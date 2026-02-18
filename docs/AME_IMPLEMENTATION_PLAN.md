# Admin Managed ESP (AME) – Implementation Plan

**Status:** Analysis only – no implementation yet.  
**Goal:** Add a new organization type “Admin Managed ESP (AME)” without breaking existing functionality.

---

## 1. Current Implementation Summary

### 1.1 Organization model and types
- **`OrganizationProfile`** (`src/models/organizationProfile.model.js`): `userId` (ref User), `organizationType` (enum `['HEI', 'ESP']`), business/branding fields, `subscription` (Stripe), `status`, `slug`, etc. One profile per organization User.
- **User**: `role` is an array (e.g. `['organization']`). Organization signup creates a User + OrganizationProfile; org profile is linked via `OrganizationProfile.userId`.

### 1.2 ESP registration (auth)
- **`auth.controller.js`** `signup`: For `role === 'organization'` it creates User (firstName, lastName, email, password, mobile, etc.) and OrganizationProfile (organizationType, organizationName, documents, address, etc.). Organization User has its own login identity.

### 1.3 Admin and organizations
- **`admin.controller.js`**: `getAllOrganizations(req, res)` with query `organizationType` (`'HEI' | 'ESP'`), pagination, search. Returns org list with user join (email, status, firstName, lastName, etc.).
- **`admin.routes.js`**: `GET /api/admin/all-organizations` (admin only). No dedicated “AME” tab or “Add AME” flow yet.

### 1.4 Organization dashboard (backend)
- **Organization routes** (`organization.routes.js`): `GET/PUT /api/organization/profile/me`, invite, members – all `isRouteAllowed(['organization'])`, use `req.user._id` as the org user.
- **Announcements / Services / Events**: Controllers use `req.user._id` as `organizationUserId` / `createdBy`. No “admin acting as org” support.

### 1.5 Subscription and profile
- **Subscription**: Stored on `OrganizationProfile.subscription`; enriched by `enrichSubscription.js`; returned in `GET /api/profile/userProfile/:userId` and `GET /api/organization/profile/me`. No backend route gates access by subscription status; gating is frontend-only.
- **Payment**: `create-subscription-checkout-session` (no auth), `create-portal-session` and `invoices` require role `organization`. AME will not use these (no payment).

### 1.6 Explore / public listing
- **`explore.controller.js`**: `getAllServices` (and similar) can filter by `providerType` (ESP | HEI) by resolving `OrganizationProfile` with that `organizationType` and using their `userId` for `createdBy`. AME will be ESP-type so they can appear in ESP listing if we choose.

### 1.7 Courses
- No “Course” entity for organizations exists. CEML “courses” are career-recommendation strings, not org-managed content. A new Course model and CRUD API are required for AME.

---

## 2. Requirements Recap (from brief)

| # | Requirement | Backend implication |
|---|--------------|----------------------|
| 1 | Admin has tab “Admin managed ESP (AME)” | New admin endpoint to list AMEs only (or filter existing list). |
| 2 | “Add AME” button → form like ESP registration without personal details | New admin-only “create AME” endpoint; create User + OrganizationProfile; personal details defaulted (see below). |
| 3 | Reuse same ESP schema; save “admin info by default” as personal details | Keep one User per AME; User must have unique email – cannot reuse admin email. Need strategy for default/contact info. |
| 4 | Admin clicks “Manage” on an AME → sees that ESP’s dashboard with “Back to admin” button | Backend must allow admin to perform org-scoped actions in context of that AME (e.g. profile/me, announcements, services, events, courses). |
| 5 | AME can do everything a normal ESP can + extra “Courses” tab | Same permissions as ESP; add Course CRUD allowed only for AME. |
| 6 | AME: full CRUD for courses | New Course model + routes; restrict to AME (and admin when acting as AME). |
| 7 | AME do not pay: no Subscriptions tab, no Profile tab (in profile section) | No backend subscription gate; API can expose `isAdminManaged` so frontend hides subscription/profile tabs. |

---

## 3. Data Model Changes

### 3.1 OrganizationProfile
- **Add:** `isAdminManaged: { type: Boolean, default: false, index: true }`.
- AME = `organizationType === 'ESP'` and `isAdminManaged === true`.
- **Optional:** Keep `subscription` as-is; for AME it stays `status: 'none'` and is never used for payment. No schema change required for subscription.

### 3.2 User (for AME)
- No schema change. Each AME still has one User (for `OrganizationProfile.userId`).
- **Constraint:** Email must be unique. So “admin info by default” cannot mean reusing admin’s email for the AME User. Options:
  - **A:** One required “contact email” in Add AME form (unique per AME).
  - **B:** System-generated unique email (e.g. `ame-<orgProfileId>@internal` or `ame-<slug>@<domain>`) and store admin’s name as display name. No login for that User unless you add “login as AME” later.
- Recommendation: **Option A** – single “Contact email” in Add AME form; use admin’s firstName/lastName as contact name. Password can be auto-generated (and optionally emailed) or set by admin; document in plan.

### 3.3 Course (new model)
- New collection, e.g. `courses`.
- Suggested fields: `organizationUserId` (ref User, required), `title`, `description`, `link` (optional), `order`/`sortOrder`, `isActive`, timestamps. Add more as needed (e.g. category, thumbnail) to match frontend.
- Index: `organizationUserId`, and optionally `organizationUserId + isActive` for listing.

---

## 4. Step-Wise Implementation Plan

### Phase 1: Backend – Mark AME and list AMEs (no new UI yet)
**Goal:** Identify AME in data and expose them to admin.

1. **1.1** Add `isAdminManaged` to `OrganizationProfile` schema (default `false`). No migration of existing data.
2. **1.2** Add admin endpoint: e.g. `GET /api/admin/ame` (or `GET /api/admin/all-organizations?organizationType=ESP&adminManagedOnly=true`) that returns only organizations with `organizationType === 'ESP'` and `isAdminManaged === true`. Reuse same response shape as `getAllOrganizations` for consistency.
3. **1.3** In `getUserProfile` and `getMyOrganizationProfile` (and any place that returns org info to frontend), include `isAdminManaged` from `OrganizationProfile` so frontend can hide Subscriptions/Profile tabs for AME.

**Files to touch:**  
`organizationProfile.model.js`, `admin.controller.js`, `admin.routes.js`, `profile.controller.js`, `organizationProfile.controller.js`.

**Risk:** None if `isAdminManaged` is additive and all queries that don’t filter by it remain unchanged.

---

### Phase 2: Backend – Add AME (admin creates an AME)
**Goal:** Admin can create an AME (User + OrganizationProfile) without the full ESP registration form.

4. **2.1** New endpoint: `POST /api/admin/ame` (admin only). Body: organization fields only (e.g. organizationName, address, country, website, contactEmail, etc. – same as ESP registration minus personal details). One of:
   - **Option A:** Require a single “contactEmail” (and optionally contact name) for the AME User; backend creates User with that email, auto-generated password (or admin-provided), and creates OrganizationProfile with `organizationType: 'ESP'`, `isAdminManaged: true`, `status: 'active'` (no approval flow if not needed).
   - **Option B:** System-generated unique email for User; contact name = admin’s name; no login for that User.
5. **2.2** Reuse validation and slug generation logic from organization signup where possible. Do not touch existing `POST /api/auth/signup` flow.
6. **2.3** Ensure new User has `role: ['organization']`, `status: 'active'`, and unique `unique_id` (e.g. UUID like other non-student users).

**Files to touch:**  
`admin.controller.js` (new `createAME`), `admin.routes.js`, optionally a small shared helper for “create org profile” if you want to avoid duplicating slug/validation.

**Risk:** Isolate in admin controller; no change to auth signup. Ensure duplicate email check for the new contact email.

---

### Phase 3: Backend – Admin “Manage” AME (acting as organization)
**Goal:** When admin chooses “Manage” on an AME, the frontend can call existing organization APIs in the context of that AME.

7. **3.1** Introduce “acting as organization” context:
   - **Option A (recommended):** Header or body parameter, e.g. `X-Acting-As-Organization-Id: <OrganizationProfile._id>` or `actingAsOrganizationId` in body/query. Only accepted when `req.user` is admin and target org has `isAdminManaged === true`. Resolve to `OrganizationProfile.userId` and set `req.organizationContext = { userId: ... }`.
   - **Option B:** Separate admin routes like `GET /api/admin/ame/:orgId/profile`, etc., that call the same service logic with `orgId` and require admin + AME check.
8. **3.2** Middleware: e.g. `resolveActingAsOrganization` – runs after `isAuthenticated` and `isRouteAllowed(['organization', 'admin'])` on organization routes. If `req.user` is admin and header/param is set, load OrganizationProfile by id, verify `isAdminManaged === true`, set `req.organizationContext = { userId: orgProfile.userId }`. If not admin or not AME, do not set context.
9. **3.3** Organization controllers (profile/me, announcements, services, events) use **effective org user id** = `req.organizationContext?.userId ?? req.user._id`. For `profile/me`: when context is set, return that org’s profile (and ensure only admin + AME can use context).
10. **3.4** Route access: Organization routes that today allow only `['organization']` become `['organization', 'admin']` where admin is allowed only when `req.organizationContext` is set (enforce in middleware or controller). This way one set of routes serves both org user and admin-acting-as-AME.

**Files to touch:**  
New middleware (e.g. `resolveActingAsOrganization.js`), `organization.routes.js`, `organizationProfile.controller.js`, `announcement.controller.js`, `service.controller.js`, `event.controller.js` (and their routes if they use `req.user._id` for org scope).

**Risk:** Strict check that context is only set for AME and admin; otherwise admin could act as any org. Do not set context for non-AME orgs.

---

### Phase 4: Backend – Courses CRUD for AME
**Goal:** AME (and admin acting as AME) can create, read, update, delete courses.

11. **4.1** Add `Course` model (e.g. `src/models/course.model.js`) with `organizationUserId` (ref User), title, description, optional link, sortOrder, isActive, timestamps.
12. **4.2** Add course controller: create, get list (by org), get one, update, delete. All scoped by effective org user id (from `req.organizationContext?.userId ?? req.user._id`).
13. **4.3** Add course routes under something like `/api/courses` or `/api/organization/courses`, protected by auth and either organization or admin. In controller (or middleware), restrict write access to AME only: resolve OrganizationProfile by effective org user id and require `organizationType === 'ESP'` and `isAdminManaged === true`. Read can be same or broader (e.g. public list by org slug later).
14. **4.4** Register routes in `main.routes.js`.

**Files to touch:**  
New `course.model.js`, new `course.controller.js`, new `course.routes.js` (or under organization routes), `main.routes.js`.

**Risk:** Only AME (and admin acting as AME) can mutate courses; normal ESP cannot. Clear checks in controller.

---

### Phase 5: Backend – Subscription and profile visibility (AME)
**Goal:** Backend supports frontend in hiding subscription and profile tabs for AME.

15. **5.1** Already covered in Phase 1: `organizationType` and `isAdminManaged` (and optionally `subscription.status`) are returned in profile/org APIs. Frontend can hide “Subscriptions” and “Profile” (in profile section) when `isAdminManaged === true`.
16. **5.2** Do **not** gate any existing backend route by subscription status for AME; leave subscription as `none` and never call Stripe for AME. No change to payment controller logic except possibly skipping Stripe for AME in the unlikely case they hit subscription endpoints (e.g. return early with “not applicable” for AME).

**Files to touch:** None if Phase 1 is done; optionally `payment.controller.js` for a safe early-return for AME on create-portal-session if desired.

---

### Phase 6: Explore and other listings (AME visibility)
**Goal:** Decide whether AME appear in public ESP lists (services, etc.).

17. **6.1** Today `getAllServices` with `providerType=ESP` uses `OrganizationProfile.find({ organizationType: 'ESP' })` and gets all ESP user ids. So AME (ESP + isAdminManaged) will automatically appear in ESP listing unless we exclude them.
18. **6.2** If product decision is “AME should appear like normal ESP,” no backend change. If “AME should be hidden from public explore,” add filter `isAdminManaged: { $ne: true }` (or `isAdminManaged: false`) when resolving org user ids for explore. Document the choice.

**Files to touch:** `explore.controller.js` (and any similar listing that filters by organizationType).

---

## 5. Backward Compatibility and Safety

- **Existing organizations:** No change. `isAdminManaged` defaults to `false`; existing HEI/ESP behaviour and APIs unchanged.
- **Existing admin all-organizations:** Keep `getAllOrganizations` as-is. New “AME list” is additive (new endpoint or new query param). Existing tabs (HEI, ESP) remain.
- **Auth and roles:** No change to JWT or role array. AME is still `role: ['organization']`; differentiation is only via `OrganizationProfile.isAdminManaged`.
- **Subscription:** No change to Stripe or webhook logic; AME simply never start checkout. Payment routes remain role-based only.
- **Organization routes:** Adding admin + context must be conditional and only for AME; otherwise existing org-only behaviour unchanged.

---

## 6. Implementation Order Summary

| Step | Description | Depends on |
|------|-------------|------------|
| 1.1 | Add `isAdminManaged` to OrganizationProfile | - |
| 1.2 | Admin endpoint to list AME only | 1.1 |
| 1.3 | Return `isAdminManaged` in profile/org APIs | 1.1 |
| 2.1–2.3 | POST /api/admin/ame (create AME) | 1.1 |
| 3.1–3.4 | Middleware + org context for admin “manage AME” | 1.1 |
| 4.1–4.4 | Course model + CRUD + AME-only write | 1.1, 3.x |
| 5.x | Subscription/profile visibility (API already supports; frontend hides tabs) | 1.3 |
| 6.1–6.2 | Explore listing: include or exclude AME | Product decision |

---

## 7. Frontend (out of scope for this repo)

For completeness, frontend will need to:
- Add admin tab “Admin managed ESP (AME)” and call new AME list endpoint.
- “Add AME” button → modal/form → `POST /api/admin/ame`.
- “Manage” → navigate to org dashboard with “acting as” context (e.g. send `X-Acting-As-Organization-Id` on all org API calls, or use a dedicated admin-AME base path that sends the header).
- “Back to admin panel” button when in AME context.
- In AME dashboard: show “Courses” tab and Course CRUD UI; hide “Subscriptions” and “Profile” (profile section) when `isAdminManaged === true`.

---

## 8. Document metadata

- **Repository:** career-explorer-backend only.
- **No implementation** has been done; this is an analysis and plan only.
- **Current functionality** must remain intact; all changes are additive or guarded by `isAdminManaged` and admin role.
