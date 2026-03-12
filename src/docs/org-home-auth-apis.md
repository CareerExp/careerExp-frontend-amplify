# Org Home Page (/org-hei/:slug, /org-esp/:slug) – APIs and auth

When you click **Home** from the org dashboard (or go directly to `/org-hei/<slug>` or `/org-esp/<slug>`), the app loads the **OrgHEI** or **OrgESP** page. That page is **not** the dashboard; it’s the public-style org home and it uses the **public** org API.

The message **"You don't have permission to access this page"** is shown by the frontend when any request returns **HTTP 403** (see `client.js` → `checkStatus`). So the 403 is coming from one of the APIs listed below.

---

## 1. API that runs on page load (most likely source of 403)

As soon as you land on `/org-hei/<slug>` or `/org-esp/<slug>`, the page dispatches:

**`getPublicOrgProfile({ identifier: slug, idType: "slug" })`**

- **Backend endpoint:**  
  **`GET /api/organization/public/s/:slug`**
- **Frontend:** `src/redux/slices/orgPublicSlice.js` → `pathFor(identifier, "slug")`  
  → `GET ${config.api}/api/organization/public/s/${encodeURIComponent(slug)}`

**Headers sent (frontend):**

| Header          | When sent |
|-----------------|-----------|
| `Content-Type`  | Always: `application/json` |
| `Authorization` | When user is logged in: `Bearer <access_token>` (optional) |

The frontend does **not** send `X-Acting-As-Organization-Id` for public org APIs, so any user (including unauthenticated) can access org home pages without permission errors. The backend should allow these requests based on the public path only.

So the backend route to check first for the 403 is:

- **`GET /api/organization/public/s/:slug`**

It should allow:

- Unauthenticated users (public view), and/or  
- Authenticated **organization** user whose org matches this slug, and/or  
- Authenticated **admin** with acting-as context for this org.

If this endpoint returns 403 for a logged-in org user viewing their own slug, the backend should be updated to allow that case.

---

## 2. Other public org APIs used on the same page (can also 403)

After the profile loads, the same page may call these (same base path, same headers via `getPublicHeaders(thunkAPI)`):

| Purpose        | Method | Path |
|----------------|--------|------|
| Public profile | GET    | `/api/organization/public/s/:slug` |
| Announcements  | GET    | `/api/organization/public/s/:slug/announcements?page=...&limit=...&sortBy=...` |
| Services       | GET    | `/api/organization/public/s/:slug/services?page=...&limit=...&sortBy=...` |
| Events         | GET    | `/api/organization/public/s/:slug/events?page=...&limit=...&sortBy=...` |
| Videos         | GET    | `/api/organization/public/s/:slug/videos?page=...&limit=...` |
| Counsellors    | GET    | `/api/organization/public/s/:slug/counsellors?page=...&limit=...` |

If the **profile** request succeeds but a **subsequent** request (e.g. announcements) returns 403, the frontend will still show the same alert and redirect. So if fixing the profile endpoint doesn’t remove the 403, check these sub-resource endpoints as well.

(If the backend uses `userId` instead of `slug`, the path is `/api/organization/public/v/:userId` and the same sub-paths under `/v/:userId`.)

---

## 3. Auth not used for this page

The **dashboard** APIs (used when you’re inside Workspace at `/workspace/...`) are **not** called when you’re on `/org-hei/:slug` or `/org-esp/:slug`. So the 403 is not from:

- `GET /api/organization/profile/me`
- `GET /api/organization/me/dashboard`
- `PUT /api/organization/profile/me`
- etc.

---

## 4. Summary for backend

- **Primary candidate for the 403:**  
  **`GET /api/organization/public/s/:slug`**

- **Request:** GET, with optional `Authorization: Bearer <token>`. No `X-Acting-As-Organization-Id` is sent from the frontend for public org pages.

- **Expected behavior:** Allow access for any user (unauthenticated or authenticated) so that org home pages linked from Explore (Institution Details) never return 403.

- If the profile call is allowed but the message still appears, check the other public routes under `/api/organization/public/s/:slug/...` (announcements, services, events, videos, counsellors) and ensure they use the same auth rules and don’t return 403 for the same users.
