# Podcasts API – Frontend Integration Reference

> Combined Phase 1, 2 & 3 APIs for Podcasts in Counsellor Dashboard → Manage My Content → Podcasts tab.

**Base URL:** `{VITE_REACT_APP_API}/api`

**Auth header:** `Authorization: Bearer <token>` for authenticated endpoints.

---

## 1. Creator Routes (`/api/creator`)

### 1.1 Upload Podcast Audio (Manual)

| Method | Route | Auth |
|--------|-------|------|
| POST | `/api/creator/uploadpodcast/:userId` | creator role |

**Params:** `userId` (creator ID)

**Content-Type:** `multipart/form-data`

**Body:** `FormData` with field `file` (audio file)

**Success 200:**
```json
{
  "message": "Podcast uploaded successfully",
  "link": "https://s3.../podcasts/xxx.mp3"
}
```

**Errors:** 400 (no file), 404 (user not found)

---

### 1.2 Upload Podcast Thumbnail

| Method | Route | Auth |
|--------|-------|------|
| POST | `/api/creator/uploadpodcastthumbnail/:userId` | creator role |

**Params:** `userId` (creator ID)

**Content-Type:** `multipart/form-data`

**Body:** `FormData` with field `file` (image file)

**Success 200:**
```json
{
  "message": "Podcast thumbnail uploaded successfully",
  "link": "https://s3.../podcast-thumbnails/xxx.jpg"
}
```

---

### 1.3 Upload Podcast Banner

| Method | Route | Auth |
|--------|-------|------|
| POST | `/api/creator/uploadpodcastbanner/:userId` | creator role |

**Params:** `userId` (creator ID)

**Content-Type:** `multipart/form-data`

**Body:** `FormData` with field `file` (image file)

**Success 200:**
```json
{
  "message": "Podcast banner uploaded successfully",
  "link": "https://s3.../podcast-banners/xxx.jpg"
}
```

---

### 1.4 Add Podcast via Spotify Link

| Method | Route | Auth |
|--------|-------|------|
| POST | `/api/creator/addpodcastspotify/:userId` | creator role |

**Params:** `userId` (creator ID)

**Content-Type:** `application/json`

**Body:**
```json
{
  "spotifyUrl": "string (required, e.g. https://open.spotify.com/episode/xxx or https://open.spotify.com/show/xxx)",
  "title": "string (required)",
  "description": "string",
  "thumbnail": "string (S3 URL or empty)",
  "bannerImage": "string (S3 URL or empty)",
  "tags": ["string"],
  "language": "string",
  "category": "string (required)"
}
```

**Spotify URL formats:** `https://open.spotify.com/episode/<id>` or `https://open.spotify.com/show/<id>`

**Categories (enum):** Education, Guidance, Career Development, College Tour, Admission, Other, Internships, Scholarships, SoftSkills, Career Planning, Career Paths, Study Abroad, Soft Skills, Hard Skills, Future Careers, Work Based Learning, Certifications, University Choices, Subject Selection, Resume Writing, Interview Skills, Job Search, Personal Branding, Entrepreneurship, Industry Insights, Day in the Life, Work Experience, Professional Growth, Self discovery, Skill Development, Career Stories, Financial Planning, Vocational Training, Mentorship Advice, Misc, Career Guide

**Success 201:**
```json
{
  "message": "Podcast created successfully",
  "podcast": {
    "_id": "...",
    "creatorId": "...",
    "title": "...",
    "description": "...",
    "thumbnail": "...",
    "bannerImage": "...",
    "spotifyLink": true,
    "spotifyUrl": "...",
    "spotifyEpisodeId": "..." or "",
    "spotifyShowId": "..." or "",
    "language": "...",
    "category": "...",
    "tags": [],
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

**Errors:** 400 (invalid Spotify URL, missing fields), 404 (user not found)

---

### 1.5 Add Podcast Manually (Upload)

| Method | Route | Auth |
|--------|-------|------|
| POST | `/api/creator/addpodcastmanual/:userId` | creator role |

**Params:** `userId` (creator ID)

**Content-Type:** `application/json`

**Body:**
```json
{
  "audioLink": "string (required, S3 URL from uploadpodcast)",
  "title": "string (required)",
  "description": "string",
  "thumbnail": "string (S3 URL or empty)",
  "bannerImage": "string (S3 URL or empty)",
  "tags": ["string"],
  "language": "string",
  "category": "string (required)"
}
```

**Success 201:**
```json
{
  "message": "Podcast created successfully",
  "podcast": { /* same structure as above, spotifyLink: false, audioLink set */ }
}
```

---

### 1.6 Get Author Podcasts (List)

| Method | Route | Auth |
|--------|-------|------|
| GET | `/api/creator/getauthorpodcasts/:userId` | public |

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
  "podcasts": [
    {
      "_id": "...",
      "creatorId": { "firstName": "...", "lastName": "..." },
      "title": "...",
      "description": "...",
      "thumbnail": "...",
      "bannerImage": "...",
      "spotifyLink": true,
      "spotifyUrl": "...",
      "audioLink": "...",
      "totalViews": 0,
      "totalLikes": 0,
      "totalRatings": 0,
      "averageRating": 0,
      "totalShares": 0,
      "createdAt": "..."
    }
  ],
  "totalPodcasts": 25,
  "currentPage": 1,
  "totalPages": 3
}
```

**Errors:** 400 (missing userId), 404 (no podcasts)

---

### 1.7 Get Podcast Detail

| Method | Route | Auth |
|--------|-------|------|
| GET | `/api/creator/podcast/:podcastId` | public |

**Params:** `podcastId`

**Success 200:**
```json
{
  "message": "Podcast details fetched successfully",
  "podcastDetails": {
    "_id": "...",
    "creatorId": "...",
    "title": "...",
    "description": "...",
    "thumbnail": "...",
    "bannerImage": "...",
    "spotifyLink": true,
    "spotifyUrl": "...",
    "spotifyEpisodeId": "...",
    "spotifyShowId": "...",
    "audioLink": "...",
    "language": "...",
    "category": "...",
    "tags": [],
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

**Errors:** 404 (podcast or creator not found)

---

### 1.8 Update Podcast

| Method | Route | Auth |
|--------|-------|------|
| POST | `/api/creator/updatepodcast/:userId/:podcastId` | creator role |

**Params:** `userId`, `podcastId`

**Content-Type:** `application/json`

**Body (all optional):**
```json
{
  "title": "string",
  "description": "string",
  "thumbnail": "string",
  "bannerImage": "string",
  "tags": ["string"],
  "language": "string",
  "category": "string",
  "audioLink": "string",
  "spotifyUrl": "string"
}
```

**Success 200:**
```json
{
  "message": "Podcast updated successfully",
  "podcast": { /* updated podcast object */ }
}
```

**Errors:** 400, 403 (unauthorized), 404

---

### 1.9 Delete Podcast

| Method | Route | Auth |
|--------|-------|------|
| DELETE | `/api/creator/deletepodcast/:userId/:podcastId` | creator role |

**Params:** `userId`, `podcastId`

**Success 200:**
```json
{
  "message": "Podcast deleted successfully"
}
```

**Errors:** 400, 403, 404

---

### 1.10 Get General Podcast Data

| Method | Route | Auth |
|--------|-------|------|
| GET | `/api/creator/getgeneralpodcastdata/:userId` | creator role |

**Params:** `userId` (creator ID)

**Success 200 (has podcasts):**
```json
{
  "message": "General podcast data fetched successfully",
  "success": true,
  "data": {
    "totalLikes": 120,
    "totalRatings": 45,
    "overallAverageRating": 4.2,
    "totalPodcasts": 8,
    "totalShares": 30,
    "totalViews": 500
  }
}
```

**Success 200 (no podcasts):**
```json
{
  "success": true,
  "message": "No podcast records available at the moment."
}
```

---

## 2. Like Routes (`/api/like`)

> All like routes require authentication.

### 2.1 Toggle Podcast Like

| Method | Route | Auth |
|--------|-------|------|
| POST | `/api/like/togglelikepodcast` | authenticated |

**Content-Type:** `application/json`

**Body:**
```json
{
  "podcastId": "string (MongoDB ObjectId)",
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
  "message": "Podcast liked successfully",
  "userLiked": true,
  "totalLikes": 11
}
```

---

### 2.2 Get Podcast Like Status

| Method | Route | Auth |
|--------|-------|------|
| GET | `/api/like/getpodcastlikestatus/:podcastId/:userId` | authenticated |

**Params:** `podcastId`, `userId`

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

### 3.1 Rate Podcast

| Method | Route | Auth |
|--------|-------|------|
| POST | `/api/rating/ratepodcast` | authenticated |

**Content-Type:** `application/json`

**Body:**
```json
{
  "podcastId": "string (MongoDB ObjectId)",
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

---

### 3.2 Get Podcast Rating Status

| Method | Route | Auth |
|--------|-------|------|
| GET | `/api/rating/getpodcastratingstatus/:podcastId/:userId` | authenticated |

**Params:** `podcastId`, `userId`

**Success 200 (no rating):**
```json
{
  "message": "User has not rated the podcast yet",
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

### 4.1 Increment Podcast Views

| Method | Route | Auth |
|--------|-------|------|
| POST | `/api/viewsAndShares/increasepodcastviewscount/:podcastId` | public |

**Params:** `podcastId`

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

---

### 4.2 Increment Podcast Shares

| Method | Route | Auth |
|--------|-------|------|
| POST | `/api/viewsAndShares/increasepodcastsharescount/:podcastId` | public |

**Params:** `podcastId`

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
| 1 | POST | `/api/creator/uploadpodcast/:userId` | Upload audio (manual) |
| 2 | POST | `/api/creator/uploadpodcastthumbnail/:userId` | Upload thumbnail |
| 3 | POST | `/api/creator/uploadpodcastbanner/:userId` | Upload banner |
| 4 | POST | `/api/creator/addpodcastspotify/:userId` | Add via Spotify link |
| 5 | POST | `/api/creator/addpodcastmanual/:userId` | Add manual (audio + metadata) |
| 6 | GET | `/api/creator/getauthorpodcasts/:userId?page=&limit=&search=` | List podcasts |
| 7 | GET | `/api/creator/podcast/:podcastId` | Get podcast detail |
| 8 | POST | `/api/creator/updatepodcast/:userId/:podcastId` | Update podcast |
| 9 | DELETE | `/api/creator/deletepodcast/:userId/:podcastId` | Delete podcast |
| 10 | GET | `/api/creator/getgeneralpodcastdata/:userId` | Aggregate podcast stats |
| 11 | POST | `/api/like/togglelikepodcast` | Toggle like |
| 12 | GET | `/api/like/getpodcastlikestatus/:podcastId/:userId` | Get like status |
| 13 | POST | `/api/rating/ratepodcast` | Submit/update rating |
| 14 | GET | `/api/rating/getpodcastratingstatus/:podcastId/:userId` | Get rating status |
| 15 | POST | `/api/viewsAndShares/increasepodcastviewscount/:podcastId` | Increment views |
| 16 | POST | `/api/viewsAndShares/increasepodcastsharescount/:podcastId` | Increment shares |

---

## 6. Typical Frontend Flows

### Add Podcast via Spotify (Figma: Upload Spotify podcast link tab)

1. User uploads thumbnail (optional): `POST /api/creator/uploadpodcastthumbnail/:userId` with FormData `file` → get `link`
2. User uploads banner (optional): `POST /api/creator/uploadpodcastbanner/:userId` with FormData `file` → get `link`
3. `POST /api/creator/addpodcastspotify/:userId` with body:
   ```json
   {
     "spotifyUrl": "https://open.spotify.com/episode/xxx",
     "title": "...",
     "description": "...",
     "thumbnail": "<from step 1 or empty>",
     "bannerImage": "<from step 2 or empty>",
     "tags": [],
     "language": "...",
     "category": "..."
   }
   ```

### Add Podcast Manually (Figma: Upload Podcast Manually tab)

1. Upload audio: `POST /api/creator/uploadpodcast/:userId` with FormData `file` → get `link`
2. Upload thumbnail (optional): `POST /api/creator/uploadpodcastthumbnail/:userId` → get `link`
3. Upload banner (optional): `POST /api/creator/uploadpodcastbanner/:userId` → get `link`
4. `POST /api/creator/addpodcastmanual/:userId` with body:
   ```json
   {
     "audioLink": "<from step 1>",
     "title": "...",
     "description": "...",
     "thumbnail": "<from step 2 or empty>",
     "bannerImage": "<from step 3 or empty>",
     "tags": [],
     "language": "...",
     "category": "..."
   }
   ```

### Podcasts Table (Figma: listing page)

1. `GET /api/creator/getauthorpodcasts/:userId?page=1&limit=10&search=`

### Podcast Detail Page

1. `GET /api/creator/podcast/:podcastId`
2. On view: `POST /api/viewsAndShares/increasepodcastviewscount/:podcastId` with `{ userId }` (if logged in)
3. On like: `POST /api/like/togglelikepodcast` with `{ podcastId, userId }`
4. On rating: `POST /api/rating/ratepodcast` with `{ podcastId, userId, rating }`
5. On share: `POST /api/viewsAndShares/increasepodcastsharescount/:podcastId` with `{ userId }` (optional)

### Edit Podcast

1. Re-upload thumbnail/banner/audio if changed
2. `POST /api/creator/updatepodcast/:userId/:podcastId` with updated fields

---

## 7. Error Response Format

```json
{
  "message": "Error description",
  "error": "Detailed message (on 500)"
}
```
