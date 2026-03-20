# Bootstrap first main admin

The backend distinguishes **main admin** (`isMainAdmin: true`) from **added admins** (`role` includes `admin` but `isMainAdmin` is false). Only the main admin can view the activity log, add/list admins, and enable/disable other admins.

## Setting the first main admin

At least one user must have `isMainAdmin: true`. There is no in-app flow to set this; it must be done once via the database.

### Option 1: MongoDB shell / Compass

1. Find the user who should be the main admin (e.g. by email).
2. Update that user:

```javascript
db.users.updateOne(
  { email: "mainadmin@example.com" },
  { $set: { isMainAdmin: true } }
);
```

To also ensure they have the admin role if needed:

```javascript
db.users.updateOne(
  { email: "mainadmin@example.com" },
  { $set: { isMainAdmin: true }, $addToSet: { role: "admin" } }
);
```

### Option 2: One-time migration script

You can run a one-off script (e.g. in `scripts/` or via a migration tool) that uses Mongoose to find a user by email and set `isMainAdmin: true`. Ensure the script is only run once and that the target email is correct.

### After bootstrap

- That user can log in and will see main-admin-only UI (activity log, manage admins) when the frontend uses `isMainAdmin` from profile or login.
- They can add more admins via **POST /api/admin/admins** (body: `{ "email": "..." }`); new admins get `isMainAdmin: false`.
- They can enable/disable those admins via **PATCH /api/admin/admins/:userId** (body: `{ "enabled": true|false }`).

---

## Frontend: API alignment and activity log

So the frontend can stay aligned with the backend, below are the contract details that affect the Add Admin screen and the Activity Logs table.

### Add Admin (Invite Sub-Admin)

- **Endpoint:** `POST /api/admin/admins`
- **Body:** `{ "email": "newadmin@example.com" }` required. **`"message"`** optional — personal message for the invitation (stored in activity log; can be used when invite email is implemented).
- Frontend should send both **email** and **message** from the Invite Sub-Admin modal so the main admin’s note is recorded and available for future invite emails.

### Activity log (GET /api/admin/activity-log)

- **Query params:** `page`, `limit`, optional `actorId`, `action`, `module`, `fromDate`, `toDate`, **`search`** (case-insensitive match on actor name, email, action, and module).
- **Response:** `{ success, data: { logs: [...], pagination: { page, limit, total, totalPages } } }`.

Each log entry includes:

| Field | Type | Frontend use |
|-------|------|--------------|
| `_id` | string | Row key |
| `actorId` | string | — |
| `actorEmail` | string | Fallback display |
| `actorName` | string | **Admin / Sub-Admin** column |
| **`actorIsMainAdmin`** | **boolean** | **Role column:** `true` → show **"Admin"**, `false` → show **"Sub-Admin"**. No need to look up the actor by ID. |
| `action` | string | Map to **Action** column label (e.g. `updateStatus` → "Updated user status", `addAdmin` → "Added admin", `enableAdmin` / `disableAdmin` → "Enabled sub-admin" / "Disabled sub-admin", `createAME` → "Added organization"). |
| `resource` | string | Backend entity type |
| **`module`** | **string** | **Module** column as-is: "Users", "Counsellors", "Organizations", "Admins", "Government Orgs". |
| `resourceId` | string | — |
| `details` | object | Build **Details** column text (e.g. status, targetEmail, targetUserId, message). |
| `timestamp` | string (ISO) | **Timestamp** column; format e.g. `YYYY-MM-DD HH:mm:ss`. |

- **Role column:** Use **`actorIsMainAdmin`** only: `log.actorIsMainAdmin === true` → "Admin", otherwise "Sub-Admin". Do not derive role from a separate user lookup.
- **Search:** Use the **`search`** query param for “Search by admin name, action, or details…”. Backend searches actor name, email, action, and module (not free-text inside `details`).
