# Admin Managed ESP (AME) – Frontend Implementation Plan

**Status:** Analysis and plan only – no implementation yet.  
**Purpose:** Step-by-step frontend plan for the “Admin managed ESPs” feature, aligned with backend phases in `AME_IMPLEMENTATION_PLAN.md`.  
**Prerequisite:** Backend phases 1–4 (or equivalent) must be in place for each frontend phase.

---

## 1. Current Frontend Implementation Summary

### 1.1 Admin dashboard and organization listing

- **Location:** Workspace (`/workspace/:id`) when `userData.activeDashboard === "admin"`. Content is driven by `PageRender.jsx` based on `currentPage` (sidebar selection).
- **Sidebar (admin):** Dashboard, Users, Counsellors, **ESP & EI User**, Records, School Directory, Profile. See `Sidebar.jsx` (case `"admin"`).
- **ESP & EI User:** Rendered by `EspEiUsersData.jsx`. Uses two tabs: “Education Service Provider” (ESP) and “Education Institutions” (HEI). Calls `getAllOrganizations({ token, organizationType, page, limit, search })` from `adminSlice.js` → `GET /api/admin/all-organizations?organizationType=ESP|HEI&...`.
- **Org list table:** Name, Email, Mobile No., Status, Actions (only “View”). “View” opens `OrgReviewModal.jsx` (review details + update status). There is **no “Add AME”** button and **no “Manage”** action, and **no AME-only tab**.

### 1.2 Organization (ESP/HEI) dashboard

- **Entry:** Same Workspace when `userData.activeDashboard === "organization"`. User identity comes from `getUserProfile({ userId, token })` and `userId` is from auth (`selectUserId`). Workspace does **not** use the route param `:id` for the logged-in user.
- **Gating in PageRender (organization):**
  - Blocked org → `PendingStatePopup`.
  - Non-active (e.g. pending) → `OrgUnderReviewScreen`.
  - Active but no subscription → `OrgSubscriptionRequiredScreen` (then access to rest of org dashboard). Subscription status from `orgProfile?.subscription?.status`; “active” or “trialing” counts as having access.
- **Org sidebar (Sidebar.jsx, case `"organization"`):** Same for ESP and HEI: Dashboard, About Us, My Counsellors, My Announcements, My Events, My Services, Messages, My Followers, **Profile**. No “Courses” and no conditional hide for Profile/Subscriptions.
- **PageRender (organization):** Renders OrgHome (OrgESPHome / OrgHEIHome), OrgAboutUs, OrgMyCounsellors, OrgMyAnnouncements, OrgMyEvents, OrgMyServices, OrgFollowers, **OrgProfile**. No Courses.

### 1.3 Organization profile and subscription

- **OrgProfile.jsx:** Uses `OrgProfileTabs`: **Subscription** | Shared Content Visibility | Personal Information | Change Password. Renders `SubscriptionTab` for tab 0. So “Subscriptions” and “Profile” (whole org profile section) are both in the same “Profile” sidebar item.
- **Subscription:** Shown to all orgs today; no `isAdminManaged` check. AME should not see subscription or the profile section (per product requirement).

### 1.4 API usage and auth

- **Client:** `src/client.js` – generic `fetch` wrapper. It does **not** add `Authorization` or any custom headers. Each Redux thunk adds `Authorization: Bearer ${token}` and optional `Content-Type` when needed.
- **Org-scoped APIs:** All use the logged-in user’s token only. Examples:
  - `organizationSlice`: `getMyOrganizationProfile`, `updateMyOrganizationProfile`, `uploadOrganizationMedia`, `sendInvitation`, `getOrganizationCounsellors` → no extra header.
  - `announcementSlice`, `eventSlice`, `serviceSlice`: create/update/delete/fetch “my” list with token only; backend infers org from `req.user._id`.
- There is **no** “acting as organization” header or context anywhere. To support admin “Manage AME”, the frontend must send an extra header (e.g. `X-Acting-As-Organization-Id: <OrganizationProfile._id>`) on every org-scoped request when in AME context.

### 1.5 Data sources for “current org”

- **User profile:** `getUserProfile(userId)` → `profileSlice.userProfile` (e.g. `userData`). Contains `role`, `activeDashboard`, and nested `organization` (e.g. `organizationId`, `organizationType`) used in Workspace and Sidebar. Backend must add `organization.isAdminManaged` (or we read it from org profile).
- **Org profile:** `getMyOrganizationProfile({ token })` → `organizationSlice.profile`. Used for subscription, `organizationType`, and org fields. Backend must include `isAdminManaged` in `GET /api/organization/profile/me` (and in user profile when it embeds org info).

### 1.6 ESP registration (reference for “Add AME” form)

- **ServiceProviderRegistrationModal.jsx:** Full ESP signup: personal (firstName, lastName, email, mobile, password) + organization (corporateName, address, state, country, registrationNo, telephone, website, documents). Submits via `signup(data)` → `POST /api/auth/signup` with `organizationType: "ESP"`. “Add AME” will be organization-only (no personal details, or minimal contact email) and a different endpoint: `POST /api/admin/ame`.

---

## 2. Backend Support Required (Checklist)

Before or in parallel with each phase, ensure backend provides:

| # | Backend requirement | Used by frontend |
|---|----------------------|------------------|
| 1 | `OrganizationProfile.isAdminManaged` in DB and returned in `GET /api/organization/profile/me` and in `GET /api/profile/userProfile/:userId` (e.g. under `organization` or org object). | Subscription bypass, hide Profile/Courses, AME tab list |
| 2 | `GET /api/admin/ame` (or `GET /api/admin/all-organizations?organizationType=ESP&adminManagedOnly=true`) returning only AME orgs, same shape as existing list. | Admin AME tab |
| 3 | `POST /api/admin/ame` – body: org fields only (+ contactEmail per plan). Creates User + OrganizationProfile with `isAdminManaged: true`. | Add AME form |
| 4 | “Acting as” support: accept header e.g. `X-Acting-As-Organization-Id: <OrganizationProfile._id>` on org routes when caller is admin and target org is AME; backend uses effective org user for all org-scoped operations. | Admin “Manage” AME → org dashboard in context |
| 5 | Course model + CRUD: e.g. `GET/POST /api/courses` (or under `/api/organization/courses`) scoped by effective org user; write restricted to AME (and admin when acting as AME). | Courses tab and CRUD UI |
| 6 | Explore listing: product decision whether AME appear in public ESP listing; backend may filter by `isAdminManaged`. | No frontend change if backend handles it |

---

## 3. Frontend Implementation Plan (Step-by-Step)

### Phase 1: Data and feature flags (backend Phase 1 done)

**Goal:** Frontend can read `isAdminManaged` and use it to skip subscription gate and prepare for hiding Profile/Subscription and showing Courses.

| Step | Task | Files / areas |
|------|------|----------------|
| 1.1 | Ensure `orgProfile` and user profile payload are typed/used so that `isAdminManaged` is available (e.g. `orgProfile?.isAdminManaged`, `userData?.organization?.isAdminManaged`). No schema in repo; just document that backend returns it. | Any component that reads org profile or user.organization |
| 1.2 | In `PageRender.jsx`, for organization dashboard: when `orgProfile?.isAdminManaged === true` (or equivalent from user profile), **skip** the subscription gate (do not show `OrgSubscriptionRequiredScreen`). AME always get full org dashboard access without payment. | `PageRender.jsx` |
| 1.3 | Add a small constant or helper, e.g. `isAME(orgProfile, userData)`, used across the app (Sidebar, PageRender, OrgProfile, etc.). | e.g. `src/utility/ame.js` or inside a shared hook |

**Deliverable:** AME orgs (once backend marks them) can access the org dashboard without subscription. No UI changes yet for tabs or Courses.

---

### Phase 2: Admin – AME tab and list (backend Phase 1–2)

**Goal:** Admin sees an “Admin managed ESP (AME)” tab and lists only AME; can open “Add AME” and “Manage” from that list.

| Step | Task | Files / areas |
|------|------|----------------|
| 2.1 | Add a third tab in the ESP & EI section: “Admin managed ESP (AME)” (or keep ESP / EI / AME as separate tabs). Prefer: **three tabs** – “Education Service Provider”, “Education Institutions”, “Admin managed ESP (AME)”. | `EspEiUsersData.jsx` |
| 2.2 | When AME tab is selected, call a **new** API: e.g. `getAMEOrganizations({ token, page, limit, search })` → `GET /api/admin/ame?page=&limit=&search=` (or same URL with `adminManagedOnly=true`). Add thunk in `adminSlice.js` and selector for AME list state. | `adminSlice.js`, `EspEiUsersData.jsx` |
| 2.3 | Reuse the same table and pagination for AME tab; columns can stay (Name, Email, Mobile No., Status, Actions). Ensure table shows “No organizations found” when list is empty. | `EspEiUsersData.jsx` |
| 2.4 | **“Add AME” button:** Place it in the AME tab toolbar (e.g. top right of the table area). Click opens a new modal (or drawer) “Add Admin managed ESP”. | `EspEiUsersData.jsx` |
| 2.5 | **Add AME form:** Fields = organization only (no firstName/lastName/password required if backend uses contact email). Minimum: organizationName, address, country, (state), registrationNo, telephone, website, **contactEmail** (required per backend Option A). Optional: documents/links if backend supports. Submit → `POST /api/admin/ame` with JSON body. New thunk: `createAME` in `adminSlice.js`. On success: close modal, show toast, refetch AME list. | New modal component (e.g. `AddAMEModal.jsx`), `adminSlice.js` |
| 2.6 | **“Manage” action for AME:** In the table row for AME list (and optionally in `OrgReviewModal` when the org is AME), add a “Manage” button. Click → navigate to Workspace in “admin managing this AME” context (see Phase 3). Pass the organization’s identifier (e.g. `OrganizationProfile._id`) so the Workspace can set acting-as context. | `EspEiUsersData.jsx`, optionally `OrgReviewModal.jsx` |

**Deliverable:** Admin can switch to AME tab, see AME list, add a new AME, and click “Manage” to open that AME’s dashboard (Phase 3 implements the actual context and UI).

---

### Phase 3: Admin “Manage” AME – acting-as context and Workspace (backend Phase 3 done)

**Goal:** When admin clicks “Manage” on an AME, they see that ESP’s dashboard with a “Back to admin” button; all org API calls must send the acting-as header.

| Step | Task | Files / areas |
|------|------|----------------|
| 3.1 | **Routing:** Option A – Add route `/workspace/admin-manage/:organizationProfileId` and render Workspace with a prop/context indicating “admin managing AME” and the org profile id. Option B – Use existing `/workspace/:id` and pass `actingAsOrganizationId` via `location.state` when navigating from admin. Recommended: **Option A** for clear URL and bookmarking. Register route in `AppRoutes.jsx` and have Workspace read `useParams()` when on that route. | `AppRoutes.jsx`, `Workspace.jsx` |
| 3.2 | **Acting-as state:** Store “admin is managing this AME” in a way that all org API calls can use it. Options: (a) Redux slice e.g. `ameContextSlice`: `{ actingAsOrganizationId: string | null }`, set when entering manage mode, clear when leaving; (b) React Context. Recommended: **Redux** so thunks can read it in `getState()`. Provide a way to set/clear (e.g. `setActingAsAME(organizationProfileId)` / `clearActingAsAME()`). | New slice e.g. `src/redux/slices/ameContextSlice.js` (or extend admin slice) |
| 3.3 | **Inject header in org API calls:** Every request that must run in AME context needs `X-Acting-As-Organization-Id: <id>` when `actingAsOrganizationId` is set. Options: (1) Central: extend `client.js` or add a wrapper that reads Redux and adds the header to all requests (complex if client is generic). (2) Per-thunk: in each org-related thunk, use `thunkAPI.getState()` and add the header if `actingAsOrganizationId` is set. Recommended: (2) with a small helper `getActingAsHeader(getState())` that returns `{ 'X-Acting-As-Organization-Id': id }` or `{}`. Apply in: `organizationSlice`, `announcementSlice`, `eventSlice`, `serviceSlice`, and later `courseSlice`. | `client.js` or utility + `organizationSlice.js`, `announcementSlice.js`, `eventSlice.js`, `serviceSlice.js` |
| 3.4 | **Workspace in manage mode:** When route is admin-manage and `organizationProfileId` is present, (1) set `actingAsOrganizationId` in Redux on mount, (2) fetch that org’s profile (e.g. via a new thunk that calls `GET /api/organization/profile/me` with acting-as header, or a dedicated admin endpoint that returns org profile by id). (3) Render org dashboard UI (same as for organization role) but with **effective** org profile and **effective** “user” for display (e.g. org name in header). (4) Show a prominent **“Back to admin”** button (e.g. in AppBar or sidebar) that clears acting-as state and navigates back to admin workspace (e.g. `/workspace/<adminUserId>` with admin dashboard). | `Workspace.jsx`, `Sidebar.jsx` (when in manage mode show “Back to admin”), `PageRender.jsx` (when in manage mode render org pages) |
| 3.5 | **Sidebar in manage mode:** When in AME context, show the **organization** sidebar (same as ESP: Dashboard, About Us, My Counsellors, … Courses when implemented, no Profile – see Phase 4). Do not show admin sidebar. | `Workspace.jsx`, `Sidebar.jsx` |
| 3.6 | **Cleanup:** On “Back to admin” or when leaving the admin-manage route, clear `actingAsOrganizationId` and optionally reset organization slice state so the next visit is clean. | `Workspace.jsx`, `ameContextSlice` |

**Deliverable:** Admin can click “Manage” on an AME, land in that ESP’s dashboard, use all org features (announcements, events, services, etc.) in that context, and return to admin panel with “Back to admin”.

---

### Phase 4: AME – Hide Profile & Subscriptions, add Courses tab (backend Phase 4–5)

**Goal:** For AME (and admin acting as AME), hide “Profile” and “Subscriptions”; show “Courses” and Course CRUD.

| Step | Task | Files / areas |
|------|------|----------------|
| 4.1 | **Sidebar – organization:** When `organizationType === 'ESP'` **and** `isAdminManaged === true` (use `orgProfile` or user profile), change menu: **remove** “Profile”, **add** “Courses”. So AME sidebar: Dashboard, About Us, My Counsellors, My Announcements, My Events, My Services, Messages, My Followers, **Courses**. (If “Messages” is same as others, keep it.) | `Sidebar.jsx` |
| 4.2 | **PageRender – organization:** For “Profile” case, if `isAdminManaged === true`, do **not** render `OrgProfile`; either show a message (“Profile is managed by admin”) or redirect to Dashboard. For “Courses” case, render new `OrgCourses` (or `AMECourses`) component when `isAdminManaged === true` (and optionally when acting-as AME). | `PageRender.jsx` |
| 4.3 | **OrgProfile (when still reachable):** If we ever show OrgProfile for AME (e.g. via direct link), hide the “Subscription” tab in `OrgProfileTabs` when `orgProfile?.isAdminManaged === true`. So: conditional tabs – Subscription tab only when not AME. | `OrgProfileTabs.jsx`, `OrgProfile.jsx` |
| 4.4 | **Courses UI:** New page component `OrgCourses.jsx` (or under `orgDashboard/`): list courses (table or cards), “Add course” button, edit/delete per row. Fields per backend: title, description, link (optional), order/sortOrder, isActive. Use a new Redux slice `courseSlice.js`: thunks `fetchCourses`, `createCourse`, `updateCourse`, `deleteCourse` calling e.g. `GET/POST/PUT/DELETE /api/courses` (or `/api/organization/courses`) with auth + acting-as header when in context. | New: `courseSlice.js`, `OrgCourses.jsx`, add “Courses” case in `PageRender.jsx` |
| 4.5 | **Course form:** Modal or inline form for create/edit: title (required), description, link, order, isActive (toggle). Validate and call create/update thunk; on delete confirm and call delete thunk. | Same component or `CourseFormModal.jsx` |

**Deliverable:** AME (and admin acting as AME) see no Profile in sidebar, no Subscription in org profile; they see Courses and can perform full CRUD on courses.

---

### Phase 5: Polish and edge cases

**Goal:** Consistent behaviour, no broken states, and clear UX for AME vs normal ESP.

| Step | Task | Files / areas |
|------|------|----------------|
| 5.1 | **OrgReviewModal:** When opened for an AME (e.g. from AME tab or from ESP tab when the row is AME), show “Manage” in addition to “View” (or replace “View” with “Manage” for AME). Ensure `organizationId` or `_id` passed to “Manage” is the one backend expects for `X-Acting-As-Organization-Id`. | `OrgReviewModal.jsx` |
| 5.2 | **Explore/public listing:** If backend excludes AME from explore, no frontend change. If backend includes AME and you need to show a badge “Admin managed” or similar, add that in the explore card/list item when `isAdminManaged` is present. | Explore components if needed |
| 5.3 | **Errors:** If acting-as header is sent but backend returns 403 (e.g. not AME or not admin), show a clear message and offer “Back to admin” or reload. | Workspace or global error handler |
| 5.4 | **Logout / session:** On logout, clear `actingAsOrganizationId`. When token expires during “manage” session, redirect to login as today; after re-login admin can go back to AME list and “Manage” again. | `authSlice` or Workspace |

---

## 4. File Change Summary

| Area | Files to add | Files to modify |
|------|--------------|------------------|
| **AME context** | `src/redux/slices/ameContextSlice.js`, optional `src/utility/ame.js` | - |
| **Admin – AME list & add** | `src/components/adminDashboard/AddAMEModal.jsx` (or similar) | `src/redux/slices/adminSlice.js`, `src/components/adminDashboard/EspEiUsersData.jsx` |
| **Admin – Manage** | - | `src/routes/AppRoutes.jsx`, `src/pages/Workspace.jsx`, `src/components/workspace/Sidebar.jsx`, `src/components/PageRender.jsx` |
| **API headers** | Helper e.g. `getActingAsHeader(getState())` | `organizationSlice.js`, `announcementSlice.js`, `eventSlice.js`, `serviceSlice.js`, new `courseSlice.js` |
| **Org – AME visibility** | - | `PageRender.jsx`, `Sidebar.jsx`, `OrgProfileTabs.jsx`, `OrgProfile.jsx` |
| **Courses** | `src/redux/slices/courseSlice.js`, `src/components/orgDashboard/OrgCourses.jsx` (and optional course form/modal) | `PageRender.jsx`, `Sidebar.jsx` |
| **Modals** | - | `OrgReviewModal.jsx` (add “Manage” for AME) |

---

## 5. Dependency Order

1. **Backend Phase 1** (isAdminManaged, list AME, return in profile) → Frontend **Phase 1** (subscription bypass, helper).
2. **Backend Phase 2** (POST create AME) → Frontend **Phase 2** (AME tab, list, Add AME, Manage button).
3. **Backend Phase 3** (acting-as middleware and org routes) → Frontend **Phase 3** (route, Redux context, header injection, Workspace manage mode, “Back to admin”).
4. **Backend Phase 4** (Course CRUD) + **Phase 5** (visibility) → Frontend **Phase 4** (hide Profile/Subscription for AME, Courses tab and CRUD).
5. Frontend **Phase 5** (polish) after Phase 3 and 4.

---

## 6. Additional Backend Support to Confirm

- Exact **header name** and **value** for acting-as (e.g. `X-Acting-As-Organization-Id` with `OrganizationProfile._id`).
- **GET profile when acting as:** Does `GET /api/organization/profile/me` with the header return that AME’s profile, and does it include `isAdminManaged`?
- **Course API base path and payload:** e.g. `POST /api/courses` body `{ title, description, link?, order?, isActive? }`, list response shape.
- **Add AME payload:** Required fields (e.g. contactEmail, organizationName, address, country, registrationNo, telephone) and optional (website, documents); confirm no personal fields if backend uses system user.
- Whether **admin** should be allowed to access **normal** (non-AME) org routes with an acting-as header; plan assumes **only AME** is allowed for acting-as.

---

## 7. Requirements Alignment (Product Brief)

| # | Requirement | How the plan covers it |
|---|-------------|-------------------------|
| 1 | Admin has a tab named **"Admin managed ESP (AME)"** | Phase 2: Third tab in admin dashboard (EspEiUsersData): "Admin managed ESP (AME)". |
| 2 | Admin sees **list of AMEs** and has **"Add AME"** button | Phase 2: AME tab calls dedicated AME list API; "Add AME" button in toolbar opens Add AME modal. |
| 3 | **Add AME** form = same as ESP registration **without personal details**; backend saves **admin info by default** as personal details to reuse same ESP schema | Phase 2: Add AME form is organization-only (org name, address, country, registrationNo, telephone, website, contactEmail, etc.). No firstName/lastName/password in the form. Backend is responsible for creating the User with default/admin/contact info so the same OrganizationProfile + User schema is reused. |
| 4 | Admin can click **Manage** on an AME → sees **that ESP’s dashboard** with a **button to return to admin panel** | Phase 3: "Manage" navigates to admin-manage route; Workspace renders org dashboard in acting-as context; prominent **"Back to admin"** button clears context and returns to admin workspace. |
| 5 | AME can do **everything a normal ESP can**, plus an **extra "Courses" tab** | Phase 4: For AME we only remove Profile (and Subscription); all other org tabs stay (Dashboard, About Us, My Counsellors, Announcements, Events, Services, Messages, Followers). We **add** the "Courses" tab. So AME = full ESP capabilities + Courses. |
| 6 | AME can perform **full CRUD for courses** | Phase 4: New Courses page and `courseSlice` with list, create, update, delete; UI with add/edit/delete and optional reorder. |
| 7 | AME **do not pay**: profile section has **no Subscriptions tab and no Profile tab** | Phase 1: Skip subscription gate for AME (no paywall). Phase 4: For AME, **remove** the "Profile" sidebar item entirely (so no profile section at all), and in OrgProfileTabs we hide Subscription when `isAdminManaged`. So AME never see Subscriptions or Profile. |

---

## 8. Backward Compatibility – Nothing Breaks

All changes are **additive or guarded by `isAdminManaged` / AME context**. Existing behaviour stays the same.

| Area | Current behaviour | How we preserve it |
|------|-------------------|---------------------|
| **Admin – ESP & EI tabs** | Two tabs (ESP, EI), same API and table. | We **add** a third tab (AME) and a **new** API for AME list. ESP and EI tabs, `getAllOrganizations`, and table behaviour are **unchanged**. |
| **Normal organizations (HEI/ESP, non-AME)** | Subscription gate, Profile in sidebar, no Courses. | We only apply AME-specific logic when `orgProfile?.isAdminManaged === true` (or when in acting-as AME context). All existing checks (subscription, sidebar, PageRender) stay for non-AME. |
| **Existing workspace route** | `/workspace/:id` – user sees their own dashboard by role. | We **add** a **new** route (e.g. `/workspace/admin-manage/:organizationProfileId`) for admin-manage only. Existing route and behaviour unchanged. |
| **Org API calls** | All use `Authorization: Bearer ${token}` only. | We **add** an **optional** header `X-Acting-As-Organization-Id` only when Redux has `actingAsOrganizationId` set (admin managing an AME). When not set (all current users), requests are identical to today. Backend ignores the header when absent. |
| **OrgReviewModal** | "View" opens modal; status update. | We **add** "Manage" for AME rows only. "View" and status update remain for all orgs; non-AME rows unchanged. |
| **Sidebar / PageRender** | One menu and routing for organization. | We branch **only** when `isAdminManaged === true` (or acting-as AME): different sidebar (no Profile, add Courses) and different PageRender cases. Normal ESP/HEI code paths unchanged. |
| **New state** | N/A | New Redux slice (`ameContextSlice`, `courseSlice`) and new components (AddAMEModal, OrgCourses) do not modify existing slices or routes; they are additive. |

**Summary:** No existing API calls are removed or changed in signature; no existing routes are replaced; no existing tabs are removed. All AME behaviour is behind `isAdminManaged` or the acting-as context.

---

## 9. Document metadata

- **Repository:** careerExp-frontend-amplify.
- **Related:** `docs/AME_IMPLEMENTATION_PLAN.md` (backend).
- **No implementation** has been done; this is an analysis and plan only.
