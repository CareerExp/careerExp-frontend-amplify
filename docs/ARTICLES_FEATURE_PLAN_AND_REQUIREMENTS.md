# Articles Feature – Counsellor Dashboard – Plan & Requirements

> **Scope:** Manage My Content → Articles tab only. No implementation in this doc; phased plan for development.

---

## 1. Codebase Analysis Summary

### 1.1 Counsellor Dashboard – Relevant Parts

| Location | Purpose |
|----------|--------|
| **PageRender.jsx** | Creator dashboard routing: `"My Content"` → `<CreatorVideos />` |
| **CreatorVideos.jsx** | Main “Manage My Content” page: 3 tabs (Videos, Articles, Podcasts). Only Videos implemented; Articles/Podcasts show “Coming Soon”. |
| **CreatorHome.jsx** | Creator dashboard home: “Add Video” opens `UploadVideoModal`. Has placeholder stats for Articles (all 0). |
| **Sidebar.jsx** | Creator menu: “My Content” → `/mycontent`. |
| **creatorSlice.js** | Video APIs: `getAuthorVideos`, `deleteVideo`, `updateVideo`, `uploadVideo`, etc. No article thunks yet. |
| **EditVideoModal.jsx** | Edit video: title, description, tags, language, category. Pattern for edit modals. |
| **UploadVideoModal.jsx** | Add video flow (used from CreatorHome). |
| **ExploreVideoPlay.jsx** | Public video detail at `/video/:videoId`. |
| **AppRoutes.jsx** | Route `/video/:videoId` → ExploreVideoPlay. No article route yet. |
| **assest.js** | Article icons: `PHome`, `PLikes`, `PRating`, `PShared`, `PViews`. |

### 1.2 Videos Feature (Reference for Articles)

- **Table (Desktop):** Date published, Thumbnail, Title, Views, Likes, Shares, Rating, Action (Edit, Delete).
- **Mobile:** Card list with thumbnail, title, rating, date, views/likes/shares, edit/delete.
- **Search:** By title; triggers API with `search` param; resets to page 1.
- **Pagination:** TablePagination, rowsPerPageOptions [5, 10, 25], count from API.
- **Edit:** EditVideoModal; update via creator slice.
- **Delete:** DeleteModal; delete via creator slice.
- **Add Video:** Button on CreatorHome opens UploadVideoModal (not on CreatorVideos).
- **Detail:** Public page at `/video/:videoId` (ExploreVideoPlay).

### 1.3 Rich Text Editor

- **Existing:** `react-quill` in `package.json`; used in:
  - `CareerPlanning.jsx` (multiple ReactQuill fields, `quill.snow.css`).
  - `Summary.jsx` (resume builder).
- **Recommendation:** Reuse **ReactQuill** for article content. API expects HTML (`content` as “HTML from rich text editor”). No new dependency; keep styling consistent (e.g. `quill.snow` theme and existing styles).

### 1.4 Categories & Tags

- **category.js** has `categories` array (Career Paths, Study Abroad, Soft Skills, etc.).
- **API doc** article categories enum includes: Education, Guidance, Career Development, College Tour, Admission, Other, Internships, Scholarships, SoftSkills, Career Planning, Career Paths, Study Abroad, … (and more).
- **Requirement:** Use a single source of truth for article categories—either extend `category.js` with an `articleCategories` list aligned to API, or use API enum if provided by backend.

---

## 2. Backend Reference (from ARTICLES_API_FRONTEND_INTEGRATION.md)

- **Base URL:** `{VITE_REACT_APP_API}/api` (frontend uses `config.api` from `import.meta.env.VITE_REACT_APP_API`).
- **Auth:** `Authorization: Bearer <token>` for creator/authenticated endpoints.

| # | Method | Route | Purpose |
|---|--------|------|---------|
| 1 | POST | `/api/creator/uploadarticlecover/:userId` | Upload cover image (FormData `file`) |
| 2 | POST | `/api/creator/addarticle/:userId` | Create article (title, category, tags, content, coverImageUrl) |
| 3 | GET | `/api/creator/getauthorarticles/:userId?page=&limit=&search=` | List author articles (paginated, search) |
| 4 | GET | `/api/creator/article/:articleId` | Get article detail |
| 5 | POST | `/api/creator/updatearticle/:userId/:articleId` | Update article |
| 6 | DELETE | `/api/creator/deletearticle/:userId/:articleId` | Delete article |
| 7 | POST | `/api/like/togglelikearticle` | Toggle like |
| 8 | GET | `/api/like/getarticlelikestatus/:articleId/:userId` | Get like status |
| 9 | POST | `/api/rating/ratearticle` | Submit/update rating (1–5) |
| 10 | GET | `/api/rating/getarticleratingstatus/:articleId/:userId` | Get rating status |
| 11 | POST | `/api/viewsAndShares/increasearticleviewscount/:articleId` | Increment views |
| 12 | POST | `/api/viewsAndShares/increasearticlesharescount/:articleId` | Increment shares |

Article list item fields: `_id`, `creatorId`, `title`, `coverImage`, `category`, `tags`, `totalViews`, `totalLikes`, `totalRatings`, `averageRating`, `totalShares`, `createdAt`.  
Article detail also has: `content`, `readTime`, `updatedAt`; plus optional `creatorDetails`.

---

## 3. Feature Requirements – Articles

### 3.1 Articles Table (Manage My Content – Articles tab)

- **Layout:** Same structure as Videos tab: one table on desktop, card list on mobile.
- **Columns (Desktop):** Date published | Cover image (thumbnail) | Title | Views | Likes | Shares | Rating | Action (Edit, Delete).
- **Data:** From `GET /api/creator/getauthorarticles/:userId` with `page`, `limit`, `search`.
- **Search:** By title; same UX as Videos (search input + button; reset to page 1).
- **Pagination:** Same as Videos (e.g. 5, 10, 25 per page); use `totalArticles` / `totalPages` from API.
- **Row click (optional):** Navigate to article detail page (counsellor view) or only use Edit for in-dashboard flow—to be decided in Phase 1.
- **Empty state:** Message when no articles (e.g. “No articles yet. Add your first article.”).
- **Icons:** Use existing Article assets (e.g. PViews, PLikes, PShared, PRating) where applicable for consistency with CreatorHome cards.

### 3.2 Add Article

- **Entry point:** “Add Article” button visible when Articles tab is active (either in CreatorVideos header area or next to search). Do not duplicate “Add Video” from CreatorHome; keep Add Article in the My Content → Articles context.
- **Form (Add Article):**
  - **Cover image:** Upload (single file). Call `POST /api/creator/uploadarticlecover/:userId` (FormData with `file`), then use returned `link` as `coverImageUrl` in create payload.
  - **Title:** Required text.
  - **Category:** Required; single select from API-supported categories (align with backend enum / `category.js`).
  - **Tags:** Multi-value (e.g. free text chips or select from existing tags if API supports).
  - **Article content:** Required; **rich text editor** (ReactQuill). Store and send HTML as `content`.
- **Submit:** `POST /api/creator/addarticle/:userId` with `title`, `category`, `tags`, `content`, `coverImageUrl`. On success: close form/modal, show success message, refresh articles list (or redirect to Articles tab and refetch).
- **Validation:** Required fields; optional client-side max length / file type for cover image per API.

### 3.3 Edit Article

- **Trigger:** Edit action in table row (same as Videos).
- **Form:** Same fields as Add Article (cover image, title, category, tags, content). Pre-fill with existing article data; if cover unchanged, keep existing `coverImageUrl`; if new file selected, call upload cover then send new URL in update.
- **Submit:** `POST /api/creator/updatearticle/:userId/:articleId` with only changed fields (or full payload as per API). On success: close modal, refresh list, success message.

### 3.4 Delete Article

- **Trigger:** Delete action in table row.
- **Flow:** Reuse existing DeleteModal pattern (confirm text e.g. “Are you sure you want to delete this article?”). On confirm: `DELETE /api/creator/deletearticle/:userId/:articleId`; then refresh list and show success.

### 3.5 Article Detail Page (Counsellor View)

- **Purpose:** Counsellor can open and read the full article (and optionally see stats).
- **Route (suggestion):** `/article/:articleId` (or `/creator/article/:articleId` if you want to separate from future public article view).
- **Data:** `GET /api/creator/article/:articleId`. Display: cover image, title, category, tags, content (render HTML safely), read time, created/updated date. Show **star ratings, likes, views** (and shares if desired).
- **Stats:** totalViews, totalLikes, averageRating (e.g. MUI Rating read-only), totalShares. Use Article icons (PLikes, PViews, PRating, PShared) for consistency.
- **Optional (later):** Like button for counsellor (toggle like), rate article (1–5), share button that calls increase shares API. If not in scope for first release, stats can be read-only.
- **Navigation:** Back to “Manage My Content” (Articles tab). Optional: Edit button to open edit form/modal or navigate to edit view.

### 3.6 Star Ratings, Likes, Views (and Shares)

- **In table:** Display only (totalViews, totalLikes, averageRating, totalShares) from list API—no interaction in table.
- **In article detail page:** Display same; optionally allow counsellor to like (toggle) and rate (1–5) using:
  - `POST /api/like/togglelikearticle` (body: articleId, userId).
  - `GET /api/like/getarticlelikestatus/:articleId/:userId` (for initial state).
  - `POST /api/rating/ratearticle` (body: articleId, userId, rating 1–5).
  - `GET /api/rating/getarticleratingstatus/:articleId/:userId` (for initial state).
- **Views:** On opening article detail, call `POST /api/viewsAndShares/increasearticleviewscount/:articleId` (with optional userId in body) once per view (e.g. on mount, avoid double-count with ref).
- **Shares:** If “Share” button is present, on click call `POST /api/viewsAndShares/increasearticlesharescount/:articleId`.

---

## 4. Phased Implementation Plan

### Phase 1 – Data & List

- **1.1** Add article-related thunks and state in Redux (e.g. in `creatorSlice.js` or a dedicated `articleSlice.js`):
  - `getAuthorArticles({ userId, page, limit, search })`
  - Handle response: `articles`, `totalArticles`, `currentPage`, `totalPages`.
- **1.2** In CreatorVideos, when **Articles** tab is active:
  - Replace “Coming Soon” with a table (desktop) and card list (mobile) mirroring Videos.
  - Columns: Date published, Cover image, Title, Views, Likes, Shares, Rating, Action (Edit placeholder, Delete placeholder).
  - Wire search and pagination to `getAuthorArticles`.
  - Use existing styles (e.g. CreatorVideo.module.css) and Article icons where relevant.
- **1.3** Empty state and loading state for Articles tab.
- **Deliverable:** Counsellor can see list of their articles (and paginate/search) with no add/edit/delete yet.

### Phase 2 – Add & Edit Article

- **2.1** **Upload cover:** Thunk `uploadArticleCover({ userId, formData, token })` → `POST /api/creator/uploadarticlecover/:userId`.
- **2.2** **Create article:** Thunk `addArticle({ userId, payload, token })` (title, category, tags, content, coverImageUrl).
- **2.3** **Add Article UI:** Button “Add Article” when Articles tab is active. Form (modal or inline page):
  - Cover upload (file input → upload thunk → set coverImageUrl).
  - Title, Category (dropdown aligned to API), Tags (e.g. chips input), Content (ReactQuill, HTML).
  - Submit → addArticle → refresh list + success.
- **2.4** **Update article:** Thunk `updateArticle({ userId, articleId, payload, token })`.
- **2.5** **Edit Article UI:** Edit modal or form (same fields as Add). Load article by id (use list item or fetch detail); on save call updateArticle, refresh list.
- **2.6** **Delete:** Thunk `deleteArticle({ userId, articleId, token })`. Wire Delete modal to deleteArticle and refresh list.
- **Deliverable:** Full CRUD for articles in Manage My Content → Articles.

### Phase 3 – Article Detail Page (Counsellor)

- **3.1** Route: e.g. `/article/:articleId` (add in AppRoutes), component e.g. `ArticleDetail.jsx` or `CreatorArticleDetail.jsx`.
- **3.2** Fetch: `GET /api/creator/article/:articleId`. Render: cover, title, category, tags, **content** (dangerouslySetInnerHTML or a safe HTML renderer), read time, dates. Show **views, likes, rating, shares** (read-only for now if you prefer).
- **3.3** On mount: call increase article views (once).
- **3.4** Link from table: e.g. title or “View” links to `/article/:articleId`.
- **3.5** Optional: Like (toggle) and Star rating (1–5) for counsellor on this page; Share button that increments shares.
- **Deliverable:** Counsellor can open an article, see full content and stats, and optionally like/rate/share.

### Phase 4 – Polish & Consistency

- **4.1** Align article categories with backend (single source in `category.js` or config).
- **4.2** Error handling and toasts for all article API calls (reuse notify/alert slice).
- **4.3** Loading states for table, add/edit form, and detail page.
- **4.4** Optional: CreatorHome “Articles” card could show real stats (total articles, total likes, etc.) if backend provides an endpoint; otherwise leave as 0 or for later.
- **4.5** Accessibility and mobile layout check for new components.

---

## 5. File / Component Checklist (Suggested)

| Item | Type | Purpose |
|------|------|--------|
| creatorSlice.js **or** articleSlice.js | Redux | Thunks: getAuthorArticles, uploadArticleCover, addArticle, updateArticle, deleteArticle; state for author articles list. |
| CreatorVideos.jsx | Update | Articles tab: table, cards, search, pagination, Add Article button, Edit/Delete modals. |
| AddArticleModal.jsx **or** AddArticleForm.jsx | New | Form: cover upload, title, category, tags, ReactQuill content; submit → addArticle. |
| EditArticleModal.jsx | New | Same fields as Add; pre-fill; submit → updateArticle. |
| ArticleDetail.jsx (or CreatorArticleDetail.jsx) | New | Page at `/article/:articleId`: full article view, stats, optional like/rate/share. |
| AppRoutes.jsx | Update | Add route `/article/:articleId`. |
| category.js (or config) | Update | Article categories aligned to API (if needed). |
| DeleteModal | Reuse | For delete article (same as video). |
| ReactQuill | Reuse | Article content in Add/Edit; import quill.snow.css. |

---

## 6. Out of Scope (For Later)

- **Podcasts:** Not in this plan.
- **Public article view:** If the same `/article/:articleId` is later used for public, consider layout/conditional content; not required for counsellor-only first release.
- **CreatorHome Articles stats:** Can stay 0 until a “get creator article stats” API exists.

---

## 7. Summary

- **Where:** Counsellor dashboard → **My Content** → **Articles** tab (CreatorVideos.jsx).
- **What:** Table like Videos, Add/Edit/Delete article (cover, title, category, tags, rich text content), Article detail page with stats (views, likes, rating, shares); optional like/rate/share on detail.
- **Rich text:** Use existing **ReactQuill**; send HTML as `content`.
- **Backend:** All endpoints described in `ARTICLES_API_FRONTEND_INTEGRATION.md`; implement in phases: list → CRUD → detail → polish.

This document is the single reference for implementing the Articles feature step-by-step without doing any implementation yet.
