# Podcasts Module – Implementation Plan

> Plan for implementing the Podcasts feature in Counsellor Dashboard → Manage My Content, aligned with Figma (Add podcast 901-65776, Listing 901-64712) and `PODCASTS_API_FRONTEND_INTEGRATION.md`.

---

## 1. Overview

- **Scope:** Podcasts tab in **Manage My Content** (same page as Videos and Articles in `CreatorVideos.jsx`).
- **Pattern:** Mirror **Videos** (YouTube link + manual upload) and **Articles** (list + add/edit/delete + detail).
- **Difference:** Podcasts can be added via **Spotify link** (metadata from Spotify) or **manual upload** (audio file + metadata). No backend “fetch Spotify metadata” API is specified; optional enhancement: call a backend endpoint to pre-fill title/description from Spotify if/when available.
- **Figma:** Add podcast modal has two tabs: “Upload Spotify podcast link” and “Upload Podcast Manually”. Listing reuses the same table structure as Videos/Articles (Date published, Thumbnail, Title, Views, Likes, Shares, Rating, Action).

---

## 2. High-Level Phases

| Phase | Description |
|-------|-------------|
| **Phase 1** | Redux + listing: state, thunks for list/get/delete, Podcasts tab content (table + mobile cards), “Upload Podcasts” button, empty state. |
| **Phase 2** | Add/Edit modal: two-tab modal (Spotify link tab + Manual upload tab), upload flows (thumbnail, banner, audio), add/update/delete wiring, DeleteModal for podcast. |
| **Phase 3** | Podcast detail view (optional in-dashboard view and/or standalone route), view count, like, rate, share (reuse patterns from articles/videos). |
| **Analytics** | Wire “Podcasts” tab in Analytics to `getGeneralPodcastData` and show chart (same pattern as Articles). |

---

## 3. Phase 1 – Redux & Listing

### 3.1 Redux (`src/redux/slices/creatorSlice.js`)

- **State**
  - Add `authorPodcasts: { podcasts: [], totalPodcasts: 0, currentPage: 1, totalPages: 0 }` (same shape as articles).
- **Thunks**
  - `getAuthorPodcasts({ userId, page, limit, search })`  
    - `GET /api/creator/getauthorpodcasts/:userId?page=&limit=&search=`
  - `deletePodcast({ userId, podcastId, token })`  
    - `DELETE /api/creator/deletepodcast/:userId/:podcastId`
- **Reducers**
  - `getAuthorPodcasts.fulfilled` → set `state.authorPodcasts` from `payload.podcasts`, `payload.totalPodcasts`, `payload.currentPage`, `payload.totalPages`.
  - `deletePodcast.fulfilled` → remove deleted podcast from `authorPodcasts.podcasts`, decrement `totalPodcasts` (same pattern as articles).
- **Selectors**
  - `selectAuthorPodcasts(state) => state.creator.authorPodcasts`

### 3.2 Categories / Languages

- **Podcast categories:** Use API enum. Either reuse `articleCategories` from `src/utility/category.js` (already includes Career Guide, Soft Skills, etc.) or add `podcastCategories` if backend list differs.
- **Languages:** Reuse existing `languages` from `category.js` (send `code` or `name` as per API).

### 3.3 CreatorVideos.jsx – Podcasts Tab (Listing Only)

- **Data fetch:** When `activeTab === 3`, call `getAuthorPodcasts` with `userId`, `podcastsPage`, `podcastsRowsPerPage`, `podcastsSearchApplied` (same pattern as articles).
- **Pagination:** `podcastsPage`, `podcastsRowsPerPage`, `podcastsSearchApplied`; search button sets `podcastsSearchApplied` and resets page.
- **Upload button:** When `activeTab === 3`, show **“Upload Podcasts”** (or “Add Podcast”) and open Add Podcast modal (Phase 2). Hide “Upload Videos” and “Upload Articles” when on Podcasts tab.
- **Table (desktop):** Same columns as Videos/Articles: **Date published**, **Thumbnail**, **Title**, **Views**, **Likes**, **Shares**, **Rating**, **Action** (View, Edit, Delete).
  - **Thumbnail:** `podcast.thumbnail` (or placeholder). If `spotifyLink` and backend provides no thumbnail, optional: use a placeholder or Spotify show image if API later supports it.
  - **Date:** `formatDateDDMMYYYY(podcast.createdAt)` (reuse `convertTimeToUTC` pattern).
  - **Rating:** `podcast.averageRating` (e.g. `Math.round(podcast.averageRating)` with MUI `Rating`).
- **Mobile:** Reuse same card layout pattern as Videos/Articles (thumbnail, title, stats, View/Edit/Delete).
- **Empty state:** “No podcasts yet. Add your first podcast.”
- **Delete:** On delete icon click, set `podcastIdToDelete`, open `DeleteModal`; on confirm call `deletePodcast`, then refresh list (or update state from reducer). Reuse existing `DeleteModal`; pass `title`/`text` for “Delete podcast” and `onDelete` that dispatches `deletePodcast`. Extend `handleConfirmDelete` to branch on video vs article vs **podcast** (e.g. `podcastIdToDelete`).

---

## 4. Phase 2 – Add/Edit Podcast Modal

### 4.1 New Component: `AddPodcastModal.jsx` (or `UploadPodcastModal.jsx`)

- **Location:** `src/models/AddPodcastModal.jsx` (or alongside `UploadVideoModal.jsx`).
- **Props:** `open`, `handleClose`, optional `podcastId` for edit (when editing, pre-fill from `getPodcastDetail`).

**Layout (match Figma 901-65776):**

- Title: **“Upload Your Podcast Here”**.
- Rules box: “Please adhere to the following rules:” with bullets (e.g. one method at a time; appropriate content; tags and category for discoverability).
- **Tabs (MUI Tabs):**
  - Tab 0: **“Upload Spotify podcast link”**
  - Tab 1: **“Upload Podcast Manually”**
- Styling: Active tab = purple background + white text; inactive = purple text on lighter background (same as video modal).

### 4.2 Tab 1 – Upload Spotify podcast link

**Fields:**

- **Spotify Link** (required): Text input, placeholder “Spotify Link”. Optional: icon (e.g. “preview”/“fetch”) to trigger future “get metadata from Spotify” if backend adds an endpoint.
- **Podcast Title** (required)
- **Upload Podcast Thumbnail:** Optional. Upload zone (dashed border); on file select call `uploadPodcastThumbnail` → store returned `link` in state.
- **Upload Banner Image:** Optional. Same pattern with `uploadPodcastBanner`.
- **Podcast Description:** Textarea (optional per API).
- **Podcast Tags:** Autocomplete (multi) from `tags` in `category.js` (same as articles/videos).
- **Select Language:** Dropdown from `languages`.
- **Select Category:** Dropdown from podcast/article categories (required).

**Submit:**

- Validate: `spotifyUrl`, `title`, `category` required.
- Call `addPodcastSpotify` with body:  
  `{ spotifyUrl, title, description, thumbnail, bannerImage, tags, language, category }`.
- On success: notify, close modal, refresh list (dispatch `getAuthorPodcasts` or rely on parent to refetch).

### 4.3 Tab 2 – Upload Podcast Manually

**Fields:**

- **Upload Audio:** Required. File input (audio); on select call `uploadPodcast` (POST `uploadpodcast/:userId` with FormData `file`) → store returned `link` as `audioLink`.
- **Podcast Title** (required)
- **Upload Podcast Thumbnail** (optional) – same as Spotify tab.
- **Upload Banner Image** (optional) – same as Spotify tab.
- **Podcast Description** (optional)
- **Podcast Tags** (optional, Autocomplete)
- **Select Language** (optional)
- **Select Category** (required)

**Submit:**

- Validate: `audioLink`, `title`, `category` required.
- Call `addPodcastManual` with body:  
  `{ audioLink, title, description, thumbnail, bannerImage, tags, language, category }`.
- On success: same as Spotify tab.

### 4.4 Redux Thunks for Phase 2 (`creatorSlice.js`)

- `uploadPodcast({ userId, formData, token })` → POST `uploadpodcast/:userId`, FormData with `file` (audio). Return `link`.
- `uploadPodcastThumbnail({ userId, formData, token })` → POST `uploadpodcastthumbnail/:userId`, FormData `file`.
- `uploadPodcastBanner({ userId, formData, token })` → POST `uploadpodcastbanner/:userId`, FormData `file`.
- `addPodcastSpotify({ userId, body, token })` → POST `addpodcastspotify/:userId`, JSON body.
- `addPodcastManual({ userId, body, token })` → POST `addpodcastmanual/:userId`, JSON body.
- `getPodcastDetail({ podcastId })` → GET `podcast/:podcastId` (for edit).
- `updatePodcast({ userId, podcastId, body, token })` → POST `updatepodcast/:userId/:podcastId`, JSON body.

No need to store “uploading podcast” in global state unless we want progress; local component state for thumbnail/banner/audio links is enough (like UploadVideoModal).

### 4.5 Edit Podcast

- When opening modal for edit, pass `podcastId`; on open dispatch `getPodcastDetail(podcastId)` and pre-fill form.
- For **Spotify** episode: show Spotify tab with `spotifyUrl`, title, description, thumbnail, banner, tags, language, category.
- For **manual** podcast: show Manual tab with `audioLink` (read-only or replace by re-upload), title, description, thumbnail, banner, tags, language, category.
- Submit calls `updatePodcast` with changed fields. Backend accepts optional: title, description, thumbnail, bannerImage, tags, language, category, audioLink, spotifyUrl.

### 4.6 Delete in CreatorVideos

- Add state: `podcastIdToDelete`.
- When user clicks Delete on a podcast row/card: `setPodcastIdToDelete(podcast._id)`, `setDeleteModalOpen(true)`, and ensure DeleteModal knows we’re in “podcast” mode (e.g. pass `contentType: 'podcast'` or check `podcastIdToDelete != null`).
- In `handleConfirmDelete`: if `podcastIdToDelete` is set, dispatch `deletePodcast({ userId, podcastId: podcastIdToDelete, token })`, then clear `podcastIdToDelete` and close modal. Same loading and error handling as video/article.

---

## 5. Phase 3 – Podcast Detail (Optional / Later)

- **In-dashboard view:** When user clicks View on a podcast, show a detail block (like ArticleDetailContent) with title, description, thumbnail/banner, embed or link to Spotify / audio player, engagement (views, like, rate, share). Requires:
  - `getPodcastDetail(podcastId)`
  - `increasePodcastViewCount(podcastId)` on mount (optional userId in body)
  - Like: `toggleLikePodcast({ podcastId, userId })` (likeSlice or creatorSlice)
  - Rating: `ratePodcast({ podcastId, userId, rating })` (ratingSlice or creatorSlice)
  - Share: `increasePodcastSharesCount(podcastId)`
- **Standalone route:** e.g. `/podcast/:podcastId` with a public-facing page (player + metadata). Can reuse same engagement APIs.

---

## 6. Analytics – Podcasts Tab

- In `CreatorAnalytics.jsx`, when **Podcasts** engagement tab is selected (`engagementTab === 3`):
  - Dispatch `getGeneralPodcastData({ userId, token })` (new thunk: GET `getgeneralpodcastdata/:userId`).
  - Use same chart pattern as Articles: e.g. `buildPodcastMonthlySeries(generalPodcastData)` with totalLikes/totalShares (or totalViews) for the chart.
  - Remove “Coming soon” and show the chart (or keep “Coming soon” until backend is ready).

Redux: add `generalPodcastData`, thunk `getGeneralPodcastData`, reducer, selector.

---

## 7. File Checklist

| File | Changes |
|------|--------|
| `src/redux/slices/creatorSlice.js` | `authorPodcasts` state; thunks: getAuthorPodcasts, deletePodcast, uploadPodcast, uploadPodcastThumbnail, uploadPodcastBanner, addPodcastSpotify, addPodcastManual, getPodcastDetail, updatePodcast; getGeneralPodcastData (analytics); reducers; selectAuthorPodcasts, selectGeneralPodcastData. |
| `src/utility/category.js` | Optionally add `podcastCategories` (or reuse `articleCategories`) so API enum is aligned. |
| `src/components/creatorDashboard/CreatorVideos.jsx` | Podcasts tab: fetch getAuthorPodcasts when activeTab===3; pagination & search state; “Upload Podcasts” button; table + mobile cards for podcasts; delete flow (podcastIdToDelete + DeleteModal); open AddPodcastModal for add/edit. |
| `src/models/AddPodcastModal.jsx` | New: two-tab modal (Spotify link + Manual), form fields, upload components for thumbnail/banner/audio, add + edit flows, validation. |
| `src/components/creatorDashboard/CreatorAnalytics.jsx` | When engagementTab===3, fetch getGeneralPodcastData and render chart (or keep “Coming soon” until API ready). |
| `DeleteModal` | No change; parent passes title/text and onDelete that handles podcast delete. |

---

## 8. API Quick Reference (from PODCASTS_API_FRONTEND_INTEGRATION.md)

- Upload audio: `POST /api/creator/uploadpodcast/:userId` (FormData `file`) → `link`
- Upload thumbnail: `POST /api/creator/uploadpodcastthumbnail/:userId` (FormData `file`) → `link`
- Upload banner: `POST /api/creator/uploadpodcastbanner/:userId` (FormData `file`) → `link`
- Add via Spotify: `POST /api/creator/addpodcastspotify/:userId` (JSON: spotifyUrl, title, description, thumbnail, bannerImage, tags, language, category)
- Add manual: `POST /api/creator/addpodcastmanual/:userId` (JSON: audioLink, title, description, thumbnail, bannerImage, tags, language, category)
- List: `GET /api/creator/getauthorpodcasts/:userId?page=&limit=&search=`
- Detail: `GET /api/creator/podcast/:podcastId`
- Update: `POST /api/creator/updatepodcast/:userId/:podcastId`
- Delete: `DELETE /api/creator/deletepodcast/:userId/:podcastId`
- General data: `GET /api/creator/getgeneralpodcastdata/:userId`

---

## 9. Implementation Order (Recommended)

1. **Redux:** authorPodcasts state, getAuthorPodcasts, deletePodcast, selectors and reducers.
2. **CreatorVideos:** Podcasts tab table + mobile cards, pagination, search, “Upload Podcasts” button, empty state, delete flow (without modal content type if reusing same DeleteModal).
3. **Redux:** uploadPodcast, uploadPodcastThumbnail, uploadPodcastBanner, addPodcastSpotify, addPodcastManual, getPodcastDetail, updatePodcast.
4. **AddPodcastModal:** UI (tabs, fields, upload zones), Spotify submit, Manual submit, validation.
5. **Edit:** getPodcastDetail pre-fill, updatePodcast on submit, “Edit” in list opening modal with podcastId.
6. **Analytics:** getGeneralPodcastData thunk + reducer, wire Podcasts tab in CreatorAnalytics (chart or “Coming soon”).
7. **Phase 3 (later):** Podcast detail view (in-dashboard and/or standalone route), like/rate/share.

This keeps the listing and add flow shippable first, then edit and analytics, then detail/engagement.
