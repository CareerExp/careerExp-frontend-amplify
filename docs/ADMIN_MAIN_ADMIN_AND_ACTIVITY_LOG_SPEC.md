# Admin: Main Admin Flag, Multiple Admins, and Activity Log — Spec for Backend

This document describes the agreed approach (main admin via `isMainAdmin` flag) and what the **backend** must implement so the **frontend** can support: multiple admins, activity logging (main admin only), add/manage admins (main admin only), and enable/disable other admins (main admin only). Share this with the backend team/AI agent.

---

## 1. Overview

- **Multiple admins:** More than one user can have admin access (same capabilities as today).
- **Main admin:** One (or a fixed few) user(s) are “main admin” via a flag `isMainAdmin: true`. All other admins are “added admins” (`role` includes admin but `isMainAdmin` is false or absent).
- **Restrictions (main admin only):**
  - View **activity log** (who did what).
  - **Add** new admins.
  - **List** admins.
  - **Enable/disable** other admins (not the main admin).
- **Activity log:** Every admin mutation is recorded with actor (who), action, resource, and timestamp. Only main admin can read the log.

No new “sub-admin” role; distinction is only **main admin** vs **added admin** via `isMainAdmin`.

---

## 2. Backend Expectations

### 2.1 User model / schema

- Add a boolean field: **`isMainAdmin`** (default `false`).
  - Exactly one user (or a small fixed set) should have `isMainAdmin: true`; all other admins have `isMainAdmin: false`.
  - When a main admin “adds an admin”, the new admin gets admin role but **not** `isMainAdmin: true`.
- Ensure existing “admin” role/flag logic remains (e.g. `role` array including `'admin'` or equivalent) so admins still get `activeDashboard: 'admin'` in profile.

### 2.2 Profile / login response (so frontend can show/hide UI)

- In the **user profile** returned by the API (e.g. `GET /api/profile/userProfile/:userId` or whatever the frontend uses after login), include:
  - **`isMainAdmin`**: `true` or `false` (or omit for non-admins; frontend will treat missing as `false`).
- Frontend will use this to show “Activity log” and “Manage admins” only when `isMainAdmin === true`.

### 2.3 Authorization rules

- **Admin routes (existing):** Unchanged — any user with admin role can call them (e.g. users list, payments, government orgs, AME, update status, etc.).
- **Main-admin-only routes:** For the routes below, after verifying the user is **admin**, also require **`isMainAdmin === true`**. If not, return **403 Forbidden**.

### 2.4 New or updated endpoints (backend responsibility)

| Method | Endpoint | Who | Description |
|--------|----------|-----|-------------|
| **GET** | `/api/admin/activity-log` | Main admin only | List activity log entries (paginated). Query: `page`, `limit`, optional `actorId`, optional `action`, optional date range. |
| **GET** | `/api/admin/admins` | Main admin only | List all users who are admins (so main admin can see who to enable/disable). Response should include at least: `_id`, `email`, `firstName`, `lastName`, `isMainAdmin`, `status` (or equivalent active/disabled), and any field used to “enable/disable” an admin. |
| **POST** | `/api/admin/admins` | Main admin only | Add a new admin. Body e.g. `{ "email": "newadmin@example.com" }` (or `userId`). Backend finds user, sets admin role, sets `isMainAdmin: false`. Optionally send invite email. Return created/updated user or success. |
| **PATCH** | `/api/admin/admins/:userId` | Main admin only | Enable or disable another admin. Body e.g. `{ "enabled": true }` or `{ "status": "active" }` (whatever the backend uses). Not allowed to disable the main admin (return 400/403 if target has `isMainAdmin: true`). |

### 2.5 Activity logging (backend responsibility)

- **Storage:** Persist admin actions in an **activity log** store (e.g. collection `AdminActivityLog` or similar) with at least:
  - **`actorId`** — ID of the admin who performed the action (from `req.user._id`).
  - **`actorEmail`** or **`actorName`** — Optional, for display.
  - **`action`** — String, e.g. `"updateStatus"`, `"createGovernmentOrganization"`, `"deleteGovernmentOrganization"`, `"createAME"`, `"enterAMEContext"`, `"exitAMEContext"`, `"addAdmin"`, `"disableAdmin"`, etc.
  - **`resource`** — String, e.g. `"User"`, `"GovernmentOrganization"`, `"AME"`, `"Admin"`.
  - **`resourceId`** — Optional; ID of affected entity.
  - **`details`** — Optional JSON (e.g. `{ "status": "blocked", "targetUserId": "..." }`).
  - **`timestamp`** — When the action happened (ISO or Date).

- **When to write a log entry:** For every **successful** admin **mutation** (create/update/delete, status change, add/disable admin, enter/exit AME context, etc.), write one entry. Either:
  - In each admin controller after the mutation, or
  - Via a shared middleware/helper that admin routes call with (action, resource, resourceId, details).

- **Endpoints to log (non-exhaustive):**  
  `PATCH /api/admin/updateStatus/:userId`, `POST/PUT/DELETE /api/admin/government-organizations`, `POST /api/admin/ame`, `POST /api/admin/ame/enter-context`, `POST /api/admin/ame/exit-context`, `POST /api/admin/admins`, `PATCH /api/admin/admins/:userId`, and any other admin mutation the backend exposes.

### 2.6 Activity log API response shape (suggestion)

So the frontend can display a table, the **GET /api/admin/activity-log** response could look like:

```json
{
  "success": true,
  "data": {
    "logs": [
      {
        "_id": "...",
        "actorId": "...",
        "actorEmail": "admin@example.com",
        "actorName": "Main Admin",
        "action": "updateStatus",
        "resource": "User",
        "resourceId": "...",
        "details": { "status": "blocked", "targetUserId": "..." },
        "timestamp": "2025-02-26T10:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100
    }
  }
}
```

Adjust field names to match backend conventions; frontend will consume whatever the backend returns.

### 2.7 Bootstrap first main admin

- Backend must ensure at least one user has `isMainAdmin: true` (e.g. migration script, seed, or manual DB update). Document how the first main admin is set so the team knows.

---

## 3. Frontend Plan (what we will do)

- **Profile:** Use `userData.isMainAdmin` from the existing profile API to show/hide main-admin-only UI.
- **Sidebar:** Show **“Activity log”** and **“Manage admins”** only when `userData.isMainAdmin === true`.
- **Activity log page:** New admin page that calls `GET /api/admin/activity-log` with pagination (and optional filters). Display table: who, action, resource, time, optional details. If backend returns 403, show “Not authorized”.
- **Manage admins page:** New admin page that:
  - Calls `GET /api/admin/admins` to list admins (main admin only).
  - Provides “Add admin” form that calls `POST /api/admin/admins` with email (or userId as per backend contract).
  - For each admin (except main admin), shows enable/disable control that calls `PATCH /api/admin/admins/:userId` with the body the backend expects (e.g. `{ "enabled": false }`).
- **Redux:** New thunks in `adminSlice.js`: e.g. `getActivityLog`, `getAdmins`, `addAdmin`, `updateAdminStatus` (or similar names), calling the endpoints above with `Authorization: Bearer <token>`.
- **Routing:** In `PageRender.jsx`, under the admin dashboard branch, add cases for “Activity log” and “Manage admins” that render the new components. No change to backend routes; only frontend routes and menu items.

---

## 4. Contract summary for backend

| Item | Expectation |
|------|-------------|
| **User model** | Add `isMainAdmin` (boolean, default false). |
| **Profile API** | Include `isMainAdmin` in the user object returned to the client. |
| **Main-admin-only** | 403 for non–main admins on: `GET /api/admin/activity-log`, `GET /api/admin/admins`, `POST /api/admin/admins`, `PATCH /api/admin/admins/:userId`. |
| **Activity log** | Persist log entries for every successful admin mutation; expose `GET /api/admin/activity-log` (paginated, main admin only). |
| **List admins** | `GET /api/admin/admins` returns list of admin users (main admin only). |
| **Add admin** | `POST /api/admin/admins` body e.g. `{ "email": "..." }`; set user as admin with `isMainAdmin: false`. |
| **Enable/disable admin** | `PATCH /api/admin/admins/:userId` with body e.g. `{ "enabled": true/false }`; forbid disabling main admin. |

Once the backend implements the above, the frontend will implement the UI and API calls as described in Section 3.
