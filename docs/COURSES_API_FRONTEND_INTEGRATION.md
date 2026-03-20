# Courses API – Frontend Integration

Summary for the **My Courses** section in the Admin Managed ESP (AME) / Organization dashboard. Share this with the frontend team.

---

## 1. Overview

- **Feature:** List, add, edit, delete, and view course details for the current ESP (organization user) or for the AME the admin is acting as.
- **Base path:** `/api/courses`
- **Auth:** All endpoints require `Authorization: Bearer <access_token>`. For **admin** acting as an AME, acting-as context must be set (e.g. after `POST /api/admin/ame/enter-context`) or send header `X-Acting-As-Organization-Id: <OrganizationProfile._id>`.
- **Roles:** `organization` or `admin` only (no `creator`).

---

## 2. Endpoints Summary (quick reference)

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/courses/me` | List my courses (search + pagination, 12 per page) |
| `GET` | `/api/courses/:id` | Get course details by ID |
| `POST` | `/api/courses` | Create course |
| `PUT` | `/api/courses/:id` | Update course |
| `DELETE` | `/api/courses/:id` | Delete course |

---

## 3. List my courses

**Request**

- **Method:** `GET`
- **URL:** `/api/courses/me`
- **Headers:** `Authorization: Bearer <token>`
- **Query parameters:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | number | `1` | Page number |
| `limit` | number | `12` | Items per page (max 50) |
| `search` | string | — | Search in title, description, referenceNumber (case-insensitive) |
| `status` | string | — | Filter: `DRAFT`, `PUBLISHED`, or `ARCHIVED` |

**Example request**

```http
GET /api/courses/me?page=1&limit=12&search=career&status=PUBLISHED
Authorization: Bearer <access_token>
```

**Success response** – `200 OK`

```json
{
  "success": true,
  "data": [
    {
      "_id": "674a1b2c3d4e5f6789012345",
      "title": "Career Planning Basics",
      "description": "Introduction to career planning and goal setting.",
      "coverImage": "https://your-s3-bucket.s3.region.amazonaws.com/courses/abc123.jpg",
      "category": "Career Guide",
      "priceType": "FREE",
      "price": null,
      "currency": "INR",
      "referenceNumber": "CRS-001",
      "duration": { "value": 4, "unit": "weeks" },
      "deliveryMode": "ONLINE",
      "whatsIncluded": ["4 modules", "Certificate"],
      "whatYouWillLearn": ["Set career goals", "Build a plan"],
      "cta": {
        "type": "LINK",
        "value": "https://example.com/enroll",
        "label": "Enroll Now"
      },
      "status": "PUBLISHED",
      "isActive": true,
      "createdBy": "674a00000000000000000001",
      "createdAt": "2025-02-18T10:00:00.000Z",
      "updatedAt": "2025-02-18T10:00:00.000Z"
    }
  ],
  "totalCourses": 1,
  "currentPage": 1,
  "totalPages": 1
}
```

**Error examples**

- `403` – No acting-as context (admin must enter AME context or send header).
- `500` – Server error; body has `success: false`, `message`, and optionally `error`.

---

## 4. Get course details

**Request**

- **Method:** `GET`
- **URL:** `/api/courses/:id`
- **Headers:** `Authorization: Bearer <token>`

**Example request**

```http
GET /api/courses/674a1b2c3d4e5f6789012345
Authorization: Bearer <access_token>
```

**Success response** – `200 OK`

```json
{
  "success": true,
  "data": {
    "_id": "674a1b2c3d4e5f6789012345",
    "title": "Career Planning Basics",
    "description": "Introduction to career planning and goal setting.",
    "coverImage": "https://your-s3-bucket.s3.region.amazonaws.com/courses/abc123.jpg",
    "category": "Career Guide",
    "priceType": "PAID",
    "price": 999,
    "currency": "INR",
    "referenceNumber": "CRS-001",
    "duration": { "value": 4, "unit": "weeks" },
    "deliveryMode": "ONLINE",
    "whatsIncluded": ["4 modules", "Certificate", "Lifetime access"],
    "whatYouWillLearn": ["Set career goals", "Build a plan", "Track progress"],
    "cta": {
      "type": "EMAIL",
      "value": "enroll@example.com",
      "label": "Contact to Enroll"
    },
    "status": "PUBLISHED",
    "isActive": true,
    "createdBy": "674a00000000000000000001",
    "updatedBy": null,
    "createdAt": "2025-02-18T10:00:00.000Z",
    "updatedAt": "2025-02-18T10:00:00.000Z"
  }
}
```

**Error examples**

- `404` – Course not found or not owned by current ESP:

```json
{
  "success": false,
  "message": "Course not found."
}
```

- `403` – No acting-as context (admin).
- `500` – Server error.

---

## 5. Create course

**Request**

- **Method:** `POST`
- **URL:** `/api/courses`
- **Headers:** `Authorization: Bearer <token>`, `Content-Type: application/json` **or** `multipart/form-data` (if uploading cover image).
- **Body:** JSON or form fields as below. For `multipart/form-data`, send `file` for the cover image; array fields and nested objects can be sent as JSON strings.

**Body fields**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | Yes | Course title |
| `description` | string | Yes | Course description |
| `coverImage` | string | No | Image URL; omit if uploading via `file` |
| `category` | string | No | e.g. "Career Guide", "Test Prep" |
| `priceType` | string | Yes | `FREE`, `PAID`, or `CUSTOM` |
| `price` | number | No | Required when priceType is PAID |
| `currency` | string | No | Default `INR` |
| `referenceNumber` | string | No | Internal reference/code |
| `duration` | object | No | `{ value: number, unit: "minutes" \| "hours" \| "days" \| "weeks" \| "months" }` |
| `deliveryMode` | string | Yes | `ONLINE`, `OFFLINE`, or `HYBRID` |
| `whatsIncluded` | array of string | No | List items |
| `whatYouWillLearn` | array of string | No | List items |
| `cta` | object | No | `{ type: "LINK" \| "EMAIL", value: string, label?: string }` |
| `status` | string | No | `DRAFT`, `PUBLISHED`, or `ARCHIVED`; default `PUBLISHED` if omitted |

**Example request (JSON)**

```http
POST /api/courses
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "title": "Career Planning Basics",
  "description": "Introduction to career planning and goal setting.",
  "category": "Career Guide",
  "priceType": "FREE",
  "currency": "INR",
  "referenceNumber": "CRS-001",
  "duration": { "value": 4, "unit": "weeks" },
  "deliveryMode": "ONLINE",
  "whatsIncluded": ["4 modules", "Certificate"],
  "whatYouWillLearn": ["Set career goals", "Build a plan"],
  "cta": {
    "type": "LINK",
    "value": "https://example.com/enroll",
    "label": "Enroll Now"
  },
  "status": "PUBLISHED"
}
```

**Example request (FormData with cover image)**

- Use `multipart/form-data`.
- Attach cover image as field name `file`.
- Send other fields as form fields; send `duration`, `cta`, `whatsIncluded`, `whatYouWillLearn` as JSON strings if needed.

**Success response** – `201 Created`

```json
{
  "success": true,
  "message": "Course created successfully.",
  "data": {
    "_id": "674a1b2c3d4e5f6789012345",
    "title": "Career Planning Basics",
    "description": "Introduction to career planning and goal setting.",
    "coverImage": "",
    "category": "Career Guide",
    "priceType": "FREE",
    "currency": "INR",
    "referenceNumber": "CRS-001",
    "duration": { "value": 4, "unit": "weeks" },
    "deliveryMode": "ONLINE",
    "whatsIncluded": ["4 modules", "Certificate"],
    "whatYouWillLearn": ["Set career goals", "Build a plan"],
    "cta": {
      "type": "LINK",
      "value": "https://example.com/enroll",
      "label": "Enroll Now"
    },
    "status": "PUBLISHED",
    "isActive": true,
    "createdBy": "674a00000000000000000001",
    "createdAt": "2025-02-18T10:00:00.000Z",
    "updatedAt": "2025-02-18T10:00:00.000Z"
  }
}
```

**Error examples**

- `400` – Validation (e.g. missing required field, invalid enum):

```json
{
  "success": false,
  "message": "Validation failed.",
  "error": "..."
}
```

- `403` – No acting-as context (admin) or not allowed role.
- `500` – Server error.

---

## 6. Update course

**Request**

- **Method:** `PUT`
- **URL:** `/api/courses/:id`
- **Headers:** `Authorization: Bearer <token>`, `Content-Type: application/json` or `multipart/form-data` (if uploading new cover image).
- **Body:** Same fields as create; only sent fields are updated. Use field name `file` for new cover image when using form-data.

**Example request**

```http
PUT /api/courses/674a1b2c3d4e5f6789012345
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "title": "Career Planning Basics (Updated)",
  "status": "ARCHIVED"
}
```

**Success response** – `200 OK`

```json
{
  "success": true,
  "message": "Course updated successfully.",
  "data": {
    "_id": "674a1b2c3d4e5f6789012345",
    "title": "Career Planning Basics (Updated)",
    "description": "Introduction to career planning and goal setting.",
    "coverImage": "https://...",
    "category": "Career Guide",
    "priceType": "FREE",
    "referenceNumber": "CRS-001",
    "duration": { "value": 4, "unit": "weeks" },
    "deliveryMode": "ONLINE",
    "whatsIncluded": ["4 modules", "Certificate"],
    "whatYouWillLearn": ["Set career goals", "Build a plan"],
    "cta": { "type": "LINK", "value": "https://example.com/enroll", "label": "Enroll Now" },
    "status": "ARCHIVED",
    "isActive": true,
    "createdBy": "674a00000000000000000001",
    "updatedBy": "674a00000000000000000002",
    "createdAt": "2025-02-18T10:00:00.000Z",
    "updatedAt": "2025-02-18T12:00:00.000Z"
  }
}
```

**Error examples**

- `404` – Course not found or not owned by current ESP:

```json
{
  "success": false,
  "message": "Course not found or unauthorized."
}
```

- `403` – No acting-as context or not allowed role.
- `500` – Server error.

---

## 7. Delete course

**Request**

- **Method:** `DELETE`
- **URL:** `/api/courses/:id`
- **Headers:** `Authorization: Bearer <access_token>`

**Example request**

```http
DELETE /api/courses/674a1b2c3d4e5f6789012345
Authorization: Bearer <access_token>
```

**Success response** – `200 OK`

```json
{
  "success": true,
  "message": "Course deleted successfully."
}
```

**Error examples**

- `404` – Course not found or not owned by current ESP:

```json
{
  "success": false,
  "message": "Course not found or unauthorized."
}
```

- `403` – No acting-as context or not allowed role.
- `500` – Server error.

---

## 8. Enums reference

| Field | Allowed values |
|-------|----------------|
| `priceType` | `FREE`, `PAID`, `CUSTOM` |
| `deliveryMode` | `ONLINE`, `OFFLINE`, `HYBRID` |
| `duration.unit` | `minutes`, `hours`, `days`, `weeks`, `months` |
| `cta.type` | `LINK`, `EMAIL` |
| `status` | `DRAFT`, `PUBLISHED`, `ARCHIVED` |

---

## 9. Admin acting-as context

- When the logged-in user is an **admin** managing an AME dashboard:
  - Either call `POST /api/admin/ame/enter-context` with `{ "actingAsOrganizationId": "<OrganizationProfile._id>" }` and then call course APIs **without** any extra header, or
  - Send header `X-Acting-As-Organization-Id: <OrganizationProfile._id>` on each request.
- If admin calls course APIs without acting-as context, the response is `403` with code `ACTING_AS_ORGANIZATION_REQUIRED`.
- Organization users (role `organization`) use their own profile; no header needed.

---

**Document version:** 1.0  
**Base URL:** Use app API base (e.g. `VITE_REACT_APP_API`).
