# HEI Organization Profile – Institute Information & Gallery API

Summary for frontend integration of **Institute Information** (additional info) and **Gallery** (HEI only). All endpoints are under the organization profile and require the user to be the organization or an admin acting as that organization.

---

## Overview

- **Base path:** `/api/organization`
- **Auth:** All endpoints require `Authorization: Bearer <access_token>`. For **admin** acting as an organization, set acting-as context (e.g. after entering AME context) or send `X-Acting-As-Organization-Id: <OrganizationProfile._id>` where applicable.
- **Roles:** `organization` or `admin` (with acting-as context for admin).
- **HEI only:** Gallery endpoints (upload, list, delete) and Institute Information fields apply only to organizations with `organizationType: "HEI"`. Non-HEI can still GET profile; gallery list returns `[]` for non-HEI.

---

## 1. Institute Information (Additional Info)

Institute Information is stored on the organization profile. Use **GET profile** to read and **PUT profile** to update (including HEI fields).

### 1.1 Get profile (read Institute Information + gallery)

**Endpoint:** `GET /api/organization/profile/me`

**Headers:** `Authorization: Bearer <token>`

**Success response – 200 OK**

```json
{
  "success": true,
  "activeDashboard": "organization",
  "data": {
    "_id": "64a1b2c3d4e5f6789012345",
    "userId": "64a1b2c3d4e5f6789012340",
    "organizationType": "HEI",
    "organizationName": "Example University",
    "slug": "example-university",
    "logo": "https://...",
    "bannerImage": "https://...",
    "description": "...",
    "website": "https://...",
    "contactEmail": "contact@example.edu",
    "totalStudents": 12000,
    "maleStudentsPercent": 52,
    "femaleStudentsPercent": 48,
    "internationalStudentsPercent": 15,
    "staffToStudentRatio": "1:34",
    "employmentRatePercent": 85,
    "offers": ["Guidance", "Career Development", "College Tour"],
    "galleryImages": [
      {
        "_id": "64a1b2c3d4e5f6789012346",
        "url": "https://your-s3.example.com/organization/gallery/abc123.jpg",
        "caption": "Main campus"
      }
    ],
    "subscription": { "status": "active" },
    "createdAt": "2024-01-15T10:00:00.000Z",
    "updatedAt": "2024-02-01T12:00:00.000Z"
  }
}
```

Institute Information fields (HEI) in `data`:

| Field | Type | Description |
|-------|------|-------------|
| `totalStudents` | number \| null | Total enrolled students |
| `maleStudentsPercent` | number \| null | Male students % (with female should total 100) |
| `femaleStudentsPercent` | number \| null | Female students % |
| `internationalStudentsPercent` | number \| null | International students % |
| `staffToStudentRatio` | string | e.g. `"1:34"` |
| `employmentRatePercent` | number \| null | Employment rate % |
| `offers` | string[] | e.g. `["Guidance", "Career Development", "College Tour"]` |

---

### 1.2 Update profile (save Institute Information)

**Endpoint:** `PUT /api/organization/profile/me`

**Headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`

**Payload (JSON body)** – send only the fields you want to update. For Institute Information (HEI), any subset of:

| Field | Type | Description |
|-------|------|-------------|
| `totalStudents` | number | Total enrolled students |
| `maleStudentsPercent` | number | Male students % |
| `femaleStudentsPercent` | number | Female students % |
| `internationalStudentsPercent` | number | International students % |
| `staffToStudentRatio` | string | e.g. `"1:34"` |
| `employmentRatePercent` | number | Employment rate % |
| `offers` | string[] | e.g. `["Guidance", "Career Development", "College Tour"]` |

**Example request body (Institute Information only)**

```json
{
  "totalStudents": 12000,
  "maleStudentsPercent": 52,
  "femaleStudentsPercent": 48,
  "internationalStudentsPercent": 15,
  "staffToStudentRatio": "1:34",
  "employmentRatePercent": 85,
  "offers": ["Guidance", "Career Development", "College Tour"]
}
```

**Success response – 200 OK**

Returns the full updated profile (same shape as GET profile):

```json
{
  "success": true,
  "message": "Organization profile updated successfully.",
  "activeDashboard": "organization",
  "data": {
    "_id": "64a1b2c3d4e5f6789012345",
    "userId": "64a1b2c3d4e5f6789012340",
    "organizationType": "HEI",
    "organizationName": "Example University",
    "totalStudents": 12000,
    "maleStudentsPercent": 52,
    "femaleStudentsPercent": 48,
    "internationalStudentsPercent": 15,
    "staffToStudentRatio": "1:34",
    "employmentRatePercent": 85,
    "offers": ["Guidance", "Career Development", "College Tour"],
    "galleryImages": [],
    "subscription": { "status": "active" }
  }
}
```

**Note:** You can also send `logo` and `bannerImage` as multipart form fields on this same endpoint (see existing org profile docs). Institute Information can be sent as JSON only.

---

## 2. Gallery (HEI only)

Gallery endpoints are for HEI organizations only. Upload adds an image to the org’s gallery; list returns all gallery images; delete removes one by id.

### 2.1 Upload gallery image

**Endpoint:** `POST /api/organization/profile/me/gallery`

**Headers:** `Authorization: Bearer <token>`, `Content-Type: multipart/form-data`

**Payload (form-data)**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `image` | file | yes | Image file (e.g. JPEG, PNG) |
| `caption` | string | no | Optional caption for the image |

**Example (curl)**

```bash
curl -X POST "https://api.example.com/api/organization/profile/me/gallery" \
  -H "Authorization: Bearer <token>" \
  -F "image=@/path/to/photo.jpg" \
  -F "caption=Main campus building"
```

**Success response – 200 OK**

```json
{
  "success": true,
  "message": "Image added to gallery.",
  "data": {
    "url": "https://your-s3.example.com/organization/gallery/xyz789.jpg",
    "caption": "Main campus building"
  }
}
```

**Error – 400 (non-HEI)**

```json
{
  "success": false,
  "message": "Gallery is only available for HEI organizations.",
  "code": "GALLERY_HEI_ONLY"
}
```

**Error – 400 (no file)**

```json
{
  "success": false,
  "message": "No image file provided.",
  "code": "NO_FILE"
}
```

---

### 2.2 Get all gallery images

**Endpoint:** `GET /api/organization/profile/me/gallery`

**Headers:** `Authorization: Bearer <token>`

**Success response – 200 OK**

```json
{
  "success": true,
  "data": [
    {
      "id": "64a1b2c3d4e5f6789012346",
      "url": "https://your-s3.example.com/organization/gallery/abc123.jpg",
      "caption": "Main campus"
    },
    {
      "id": "64a1b2c3d4e5f6789012347",
      "url": "https://your-s3.example.com/organization/gallery/def456.jpg",
      "caption": "Library"
    }
  ]
}
```

For non-HEI organizations, `data` is an empty array `[]`. Use the `id` of each item when calling the delete endpoint.

---

### 2.3 Delete gallery image

**Endpoint:** `DELETE /api/organization/profile/me/gallery/:imageId`

**Headers:** `Authorization: Bearer <token>`

**Path parameter:** `imageId` – the `id` of the gallery image from the list response (or from `data.galleryImages[]._id` on GET profile).

**Example**

```http
DELETE /api/organization/profile/me/gallery/64a1b2c3d4e5f6789012346
Authorization: Bearer <token>
```

**Success response – 200 OK**

```json
{
  "success": true,
  "message": "Gallery image removed."
}
```

**Error – 404 (image not found)**

```json
{
  "success": false,
  "message": "Gallery image not found.",
  "code": "IMAGE_NOT_FOUND"
}
```

**Error – 400 (non-HEI)**

```json
{
  "success": false,
  "message": "Gallery is only available for HEI organizations.",
  "code": "GALLERY_HEI_ONLY"
}
```

---

## 3. Quick reference

| Section | Method | Path | Description |
|--------|--------|------|-------------|
| Institute Information | GET | `/api/organization/profile/me` | Get full profile (includes HEI fields + gallery) |
| Institute Information | PUT | `/api/organization/profile/me` | Update profile (body: HEI fields + any other allowed fields) |
| Gallery | POST | `/api/organization/profile/me/gallery` | Upload image (form: `image`, optional `caption`) |
| Gallery | GET | `/api/organization/profile/me/gallery` | List gallery images |
| Gallery | DELETE | `/api/organization/profile/me/gallery/:imageId` | Delete one image by id |

All endpoints require authentication and organization (or admin acting-as) context.
