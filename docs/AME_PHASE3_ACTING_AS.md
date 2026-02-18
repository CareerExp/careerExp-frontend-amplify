# Phase 3: Admin “Open Dashboard” (acting as AME) – Frontend

When the admin clicks **“Open Dashboard”** for an AME in the list, the frontend should open the ESP dashboard in the context of that AME and send the acting-as context on every org-scoped API call.

## 1. Acting-as context

- **Header (preferred):** `X-Acting-As-Organization-Id: <OrganizationProfile._id>`
- **Alternative:** Query param `actingAsOrganizationId=<OrganizationProfile._id>` (GET) or body field `actingAsOrganizationId` (POST/PUT).
- **Value:** Use the **OrganizationProfile document `_id`**. From the AME list, each item has `_id` (org profile id) and `userId` (org’s User id). Use **`_id`** for this header.

## 2. When to send it

Send the header on **every** request that is organization-scoped while the admin is viewing that AME’s dashboard:

| Area | Endpoints |
|------|-----------|
| Organization | `GET/PUT /api/organization/profile/me`, `POST /api/organization/invite`, `GET /api/organization/members` |
| Announcements | `GET /api/announcements/me/list`, `POST /api/announcements`, `PUT /api/announcements/:id` |
| Services | `GET /api/services/me`, `POST /api/services`, `PUT /api/services/:id`, `DELETE /api/services/:id` |
| Events | `GET /api/events/me`, `POST /api/events`, `PUT /api/events/:id`, `DELETE /api/events/:id` |

Do **not** send it on public routes (feed, get by id), admin-only routes (`GET /api/admin/ame`), or CTA response routes.

## 3. Frontend flow

1. Admin is on the AME list; each row has `_id` (org profile id) and `organizationName`.
2. Admin clicks **“Open Dashboard”** for one AME.
3. Navigate to the ESP dashboard and set acting-as state: `actingAsOrganizationId = row._id`.
4. For all org-scoped API calls from that dashboard, add:  
   `X-Acting-As-Organization-Id: <actingAsOrganizationId>`.
5. Show **“Back to admin panel”** to clear acting-as state and navigate back.

## 4. Errors

- **403** “Acting-as organization context required” or “You can only act as an Admin Managed ESP (AME)” → admin did not send the header, or the org is not an AME.
- **404** “Organization not found” → invalid or unknown `OrganizationProfile._id`.
