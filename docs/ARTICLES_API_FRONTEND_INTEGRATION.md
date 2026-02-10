# Articles API – Frontend Integration Reference

> Combined Phase 1 & 2 APIs for Articles in Counsellor Dashboard → Manage My Content → Articles tab.

**Base URL:** `{VITE_REACT_APP_API}/api`

**Auth header:** `Authorization: Bearer <token>` for authenticated endpoints.

---

## 1. Creator Routes (`/api/creator`)

### 1.1 Upload Article Cover Image

| Method | Route | Auth |
|--------|-------|------|
| POST | `/api/creator/uploadarticlecover/:userId` | creator role |

**Params:** `userId` (creator/counsellor ID)

**Content-Type:** `multipart/form-data`

**Body:** `FormData` with field `file` (image file)

**Success 200:**
```json
{
  "message": "Cover image uploaded successfully",
  "link": "https://s3.../article-covers/xxx.jpg"
}
```

**Errors:** 400 (no file), 404 (user not found)

---

### 1.2 Create Article

| Method | Route | Auth |
|--------|-------|------|
| POST | `/api/creator/addarticle/:userId` | creator role |

**Params:** `userId` (creator ID)

**Content-Type:** `application/json`

**Body:**
```json
{
  "title": "string (required)",
  "category": "string (required)",
  "tags": ["string"],
  "content": "string (required, HTML from rich text editor)",
  "coverImageUrl": "string (S3 URL from upload)"
}
```

**Categories (enum):**  
Education, Guidance, Career Development, College Tour, Admission, Other, Internships, Scholarships, SoftSkills, Career Planning, Career Paths, Study Abroad, Soft Skills, Hard Skills, Future Careers, Work Based Learning, Certifications, University Choices, Subject Selection, Resume Writing, Interview Skills, Job Search, Personal Branding, Entrepreneurship, Industry Insights, Day in the Life, Work Experience, Professional Growth, Self discovery, Skill Development, Career Stories, Financial Planning, Vocational Training, Mentorship Advice, Misc, Career Guide

**Success 201:**
```json
{
  "message": "Article created successfully",
  "article": {
    "_id": "...",
    "creatorId": "...",
    "title": "...",
    "coverImage": "...",
    "category": "...",
    "tags": [],
    "content": "...",
    "readTime": 0,
    "totalViews": 0,
    "totalLikes": 0,
    "totalRatings": 0,
    "averageRating": 0,
    "totalShares": 0,
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

**Errors:** 400 (missing fields), 404 (user not found)

---

### 1.3 Get Author Articles (List)

| Method | Route | Auth |
|--------|-------|------|
| GET | `/api/creator/getauthorarticles/:userId` | public |

**Params:** `userId` (creator ID)

**Query:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| page | number | 1 | Page number |
| limit | number | 10 | Items per page |
| search | string | "" | Search by title |

**Success 200:**
```json
{
  "message": "My Content retrieved successfully.",
  "success": true,
  "articles": [
    {
      "_id": "...",
      "creatorId": { "firstName": "...", "lastName": "..." },
      "title": "...",
      "coverImage": "...",
      "category": "...",
      "tags": [],
      "totalViews": 0,
      "totalLikes": 0,
      "totalRatings": 0,
      "averageRating": 0,
      "totalShares": 0,
      "createdAt": "..."
    }
  ],
  "totalArticles": 25,
  "currentPage": 1,
  "totalPages": 3
}
```

**Errors:** 400 (missing userId), 404 (no articles)

---

### 1.4 Get Article Detail

| Method | Route | Auth |
|--------|-------|------|
| GET | `/api/creator/article/:articleId` | public |

**Params:** `articleId`

**Success 200:**
```json
{
  "message": "Article details fetched successfully",
  "articleDetails": {
    "_id": "...",
    "creatorId": "...",
    "title": "...",
    "coverImage": "...",
    "category": "...",
    "tags": [],
    "content": "...",
    "readTime": 0,
    "totalViews": 0,
    "totalLikes": 0,
    "totalRatings": 0,
    "averageRating": 0,
    "totalShares": 0,
    "createdAt": "...",
    "updatedAt": "..."
  },
  "creatorDetails": {
    "_id": "...",
    "firstName": "...",
    "lastName": "...",
    "profilePicture": "..."
  }
}
```

**Errors:** 404 (article or creator not found)

---

### 1.5 Update Article

| Method | Route | Auth |
|--------|-------|------|
| POST | `/api/creator/updatearticle/:userId/:articleId` | creator role |

**Params:** `userId`, `articleId`

**Content-Type:** `application/json`

**Body (all optional):**
```json
{
  "title": "string",
  "category": "string",
  "tags": ["string"],
  "content": "string",
  "coverImageUrl": "string"
}
```

**Success 200:**
```json
{
  "message": "Article updated successfully",
  "article": { /* updated article object */ }
}
```

**Errors:** 400, 403 (unauthorized), 404

---

### 1.6 Delete Article

| Method | Route | Auth |
|--------|-------|------|
| DELETE | `/api/creator/deletearticle/:userId/:articleId` | creator role |

**Params:** `userId`, `articleId`

**Success 200:**
```json
{
  "message": "Article deleted successfully"
}
```

**Errors:** 400, 403, 404

---

## 2. Like Routes (`/api/like`)

> All like routes require authentication.

### 2.1 Toggle Article Like

| Method | Route | Auth |
|--------|-------|------|
| POST | `/api/like/togglelikearticle` | authenticated |

**Content-Type:** `application/json`

**Body:**
```json
{
  "articleId": "string (MongoDB ObjectId)",
  "userId": "string (MongoDB ObjectId)"
}
```

**Success 200 (unliked):**
```json
{
  "message": "Like removed successfully",
  "userLiked": false,
  "totalLikes": 10
}
```

**Success 201 (liked):**
```json
{
  "message": "Article liked successfully",
  "userLiked": true,
  "totalLikes": 11
}
```

**Errors:** 404 (article/user not found)

---

### 2.2 Get Article Like Status

| Method | Route | Auth |
|--------|-------|------|
| GET | `/api/like/getarticlelikestatus/:articleId/:userId` | authenticated |

**Params:** `articleId`, `userId`

**Success 200:**
```json
{
  "message": "Like status fetched successfully",
  "userLiked": true
}
```

---

## 3. Rating Routes (`/api/rating`)

> All rating routes require authentication.

### 3.1 Rate Article

| Method | Route | Auth |
|--------|-------|------|
| POST | `/api/rating/ratearticle` | authenticated |

**Content-Type:** `application/json`

**Body:**
```json
{
  "articleId": "string (MongoDB ObjectId)",
  "userId": "string (MongoDB ObjectId)",
  "rating": 1
}
```

`rating` must be 1–5.

**Success 200/201:**
```json
{
  "message": "Rating created successfully",
  "averageRating": 4.2,
  "rating": 5
}
```

**Errors:** 400, 404

---

### 3.2 Get Article Rating Status

| Method | Route | Auth |
|--------|-------|------|
| GET | `/api/rating/getarticleratingstatus/:articleId/:userId` | authenticated |

**Params:** `articleId`, `userId`

**Success 200 (no rating):**
```json
{
  "message": "User has not rated the article yet",
  "rating": 0
}
```

**Success 200 (has rating):**
```json
{
  "message": "Rating status fetched successfully",
  "rating": 4
}
```

---

## 4. Views & Shares Routes (`/api/viewsAndShares`)

> No authentication required.

### 4.1 Increment Article Views

| Method | Route | Auth |
|--------|-------|------|
| POST | `/api/viewsAndShares/increasearticleviewscount/:articleId` | public |

**Params:** `articleId`

**Content-Type:** `application/json`

**Body (optional):**
```json
{
  "userId": "string (MongoDB ObjectId)"
}
```

If `userId` is sent, the view is recorded in user history.

**Success 200:**
```json
{
  "message": "Views count increased successfully",
  "updatedValue": 101
}
```

**Errors:** 400 (invalid ID), 404 (article not found)

---

### 4.2 Increment Article Shares

| Method | Route | Auth |
|--------|-------|------|
| POST | `/api/viewsAndShares/increasearticlesharescount/:articleId` | public |

**Params:** `articleId`

**Content-Type:** `application/json`

**Body (optional):**
```json
{
  "userId": "string (MongoDB ObjectId)"
}
```

**Success 200:**
```json
{
  "message": "Shares count increased successfully",
  "updatedValue": 12
}
```

---

## 5. Quick Reference Table

| # | Method | Route | Purpose |
|---|--------|-------|---------|
| 1 | POST | `/api/creator/uploadarticlecover/:userId` | Upload cover image |
| 2 | POST | `/api/creator/addarticle/:userId` | Create article |
| 3 | GET | `/api/creator/getauthorarticles/:userId?page=&limit=&search=` | List articles |
| 4 | GET | `/api/creator/article/:articleId` | Get article detail |
| 5 | POST | `/api/creator/updatearticle/:userId/:articleId` | Update article |
| 6 | DELETE | `/api/creator/deletearticle/:userId/:articleId` | Delete article |
| 7 | POST | `/api/like/togglelikearticle` | Toggle like |
| 8 | GET | `/api/like/getarticlelikestatus/:articleId/:userId` | Get like status |
| 9 | POST | `/api/rating/ratearticle` | Submit/update rating |
| 10 | GET | `/api/rating/getarticleratingstatus/:articleId/:userId` | Get rating status |
| 11 | POST | `/api/viewsAndShares/increasearticleviewscount/:articleId` | Increment views |
| 12 | POST | `/api/viewsAndShares/increasearticlesharescount/:articleId` | Increment shares |

---

## 6. Typical Frontend Flows

### Add Article
1. `POST /api/creator/uploadarticlecover/:userId` with FormData (`file`) → get `link`
2. `POST /api/creator/addarticle/:userId` with `{ title, category, tags, content, coverImageUrl: link }`

### Articles Table (Counsellor)
1. `GET /api/creator/getauthorarticles/:userId?page=1&limit=10&search=`

### Article Detail Page
1. `GET /api/creator/article/:articleId`
2. On view: `POST /api/viewsAndShares/increasearticleviewscount/:articleId` with `{ userId }` (if logged in)
3. On like: `POST /api/like/togglelikearticle` with `{ articleId, userId }`
4. On rating: `POST /api/rating/ratearticle` with `{ articleId, userId, rating }`
5. On share: `POST /api/viewsAndShares/increasearticlesharescount/:articleId` with `{ userId }` (optional)

### Edit Article
1. `POST /api/creator/uploadarticlecover/:userId` if cover changed
2. `POST /api/creator/updatearticle/:userId/:articleId` with updated fields

---

## 7. Error Response Format

```json
{
  "message": "Error description",
  "error": "Detailed message (on 500)"
}
```
