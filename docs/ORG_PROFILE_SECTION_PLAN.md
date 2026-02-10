# Organization Dashboard – Profile Section: Step-wise Development Plan

## Objective
Update the Profile section for the **organization dashboard** so that:
- **Replace** two existing tabs: **Social Account** and **Educational Information**.
- **Add** two new tabs: **Subscription** and **Shared Content Visibility**.
- **Reuse** two existing tabs: **Change Password** and **Personal Information**.
- **Extend** the **Personal Information** tab with new content (per Figma).

Tab order (per Figma 951-71039): **Subscription** → **Shared Content Visibility** → **Personal Information** → **Change Password**.

---

## Current State (Brief)
- **Profile** is a shared component used for both **user** and **organization** dashboards (`src/components/Profile.jsx`).
- **ProfileTabs** (`src/components/profile/ProfileTabs.jsx`) shows 5 tabs; visibility depends on `userData?.activeDashboard`:
  - Personal Information, Change Password (always)
  - Interests (only for `user`)
  - Social Account, Educational Information (hidden for `creator`/`admin`, so **shown for organization**).
- **ProfileTabContent** (`src/components/profile/ProfileTabContent.jsx`) maps `tabValue` 0–4 to: PersonalInfoForm, PasswordForm, InterestsTab, SocialAccountsForm, EducationForm.
- Organization profile is rendered when `currentPage === "Profile"` in `PageRender.jsx` (workspace).

---

## Step-wise Plan

### Phase 1: Tab structure and routing

**Step 1.1 – Make Profile tabs dashboard-aware for organization**
- In **ProfileTabs.jsx**:
  - When `userData?.activeDashboard === "organization"`:
    - Render exactly **4** tabs in this order: **Subscription**, **Shared Content Visibility**, **Personal Information**, **Change Password**.
  - When not organization: keep existing behavior (Personal Information, Change Password, Interests for user only, Social Account, Educational Information where applicable).
- Ensure tab indices used for organization are consistent (e.g. org: 0=Subscription, 1=Shared Content Visibility, 2=Personal Information, 3=Change Password).

**Step 1.2 – Route tab value to correct content for organization**
- In **Profile.jsx** (or wherever `tabValue` is used):
  - When `userData?.activeDashboard === "organization"`, treat `tabValue` as the org tab index (0–3) so that:
    - Submit/validation logic (e.g. which form is being submitted) is correct.
    - Any `useEffect` that resets `tabValue` when switching dashboards (e.g. creator tab reset) does not break org; optionally add an org-specific reset rule if needed (e.g. reset to 0 when switching to org).

**Step 1.3 – ProfileTabContent: organization branch**
- In **ProfileTabContent.jsx**:
  - Accept `userData` (or `activeDashboard`) so content is dashboard-aware.
  - When `userData?.activeDashboard === "organization"`:
    - `tabValue === 0` → render **Subscription** tab content (new component, placeholder OK initially).
    - `tabValue === 1` → render **Shared Content Visibility** tab content (new component, placeholder OK initially).
    - `tabValue === 2` → render **Personal Information** (existing `PersonalInfoForm`; later Step 2 will extend it).
    - `tabValue === 3` → render **Change Password** (existing `PasswordForm`).
  - When not organization: keep existing `switch (tabValue)` mapping so user/creator/admin flows are unchanged.

---

### Phase 2: New tab components (UI + structure)

**Step 2.1 – Subscription tab**
- Create a new component, e.g. **`SubscriptionTab.jsx`** (under `src/components/profile/` or `src/components/orgDashboard/` as per project convention).
- Implement layout to match Figma 951-71039 (Subscription tab):
  - **Left column – “Your Plan Includes”**: heading + list of plan features (e.g. Dedicated ESP Branded Profile Page, Visibility on Partners Page, Verified Partner badge, Access to ESP Dashboard, Lead & enquiry management, Ability to manage and update services anytime) with icons as in design.
  - **Right column – “Available Plans”**: heading + plan cards:
    - **Annual Plan** card: “Your Current Plan” tag, “Billed yearly”, price e.g. “$29,999/year”, “Save 17% annually” badge.
    - **Monthly Plan** card: “Billed monthly”, price e.g. “$2,999/month”.
  - Bottom: primary CTA button, e.g. **“Renew Subscription”** (gradient styling per Figma).
- Use placeholder/copy data and static content first; no API integration yet.
- Reuse design tokens (colors, typography, spacing) from Figma/design system.

**Step 2.2 – Shared Content Visibility tab**
- Create a new component, e.g. **`SharedContentVisibilityTab.jsx`**.
- Implement layout and controls per Figma for “Shared Content Visibility” (if the node has sub-nodes, fetch design context for that node later for exact layout).
- Typical content: settings that control what shared content is visible (e.g. toggles, checkboxes, or dropdowns). Use placeholder state and UI first; wire to API later.
- Match typography, colors, and spacing to design.

**Step 2.3 – Wire new components into ProfileTabContent**
- In **ProfileTabContent.jsx**, for organization:
  - Import and render `SubscriptionTab` for `tabValue === 0`.
  - Import and render `SharedContentVisibilityTab` for `tabValue === 1`.
- Pass any needed props (e.g. `userData`, `organizationProfile` from Redux if required later).

---

### Phase 3: Personal Information tab – new content

**Step 3.1 – Identify new fields/sections from Figma**
- From Figma 951-71039 (and any child nodes for “Personal Information”):
  - List new fields or sections to add (e.g. contact person, billing address, etc.).
  - Note layout: one column vs two, order of sections, required vs optional.

**Step 3.2 – Extend PersonalInfoForm for organization**
- In **PersonalInfoForm.jsx** (or an org-specific wrapper if you prefer to keep user form untouched):
  - When `userData?.activeDashboard === "organization"` (or when rendered from org Profile):
    - Render additional sections/fields as per Figma.
  - Reuse existing fields where they apply to organization (e.g. name, email, phone) and add org-only fields without breaking user/creator flows.
- Keep form state and submit logic in **Profile.jsx** consistent: extend `formData` and `handleInputChange` for new fields if they are part of the same profile API; otherwise plan a separate submit for org-only data (Step 3.4).

**Step 3.3 – Styling and accessibility**
- Match new Personal Information layout and typography to Figma.
- Ensure labels, validation messages, and focus order are accessible.

**Step 3.4 – Save/API for new Personal Information fields**
- If new fields are stored on **user** profile: extend `updateUserProfile` payload and backend contract in plan (no backend implementation in this frontend-only plan).
- If new fields are stored on **organization** profile: use `updateMyOrganizationProfile` (and extend `organizationSlice`/API contract as needed). Implement submit handler in Profile or in PersonalInfoForm (with dispatch from Profile) so that the correct API is called when the user clicks Save on the Personal Information tab as organization.

---

### Phase 4: Data and API (outline)

**Step 4.1 – Subscription tab**
- Define where subscription/plan data comes from (e.g. organization profile, separate subscription API, or mock).
- Add Redux/state and API calls if needed (e.g. `getSubscription`, `renewSubscription`).
- Wire **SubscriptionTab** to real data; handle loading and error states.
- “Renew Subscription” button: define action (e.g. navigate to payment, call API, or open modal) and implement.

**Step 4.2 – Shared Content Visibility tab**
- Define backend model for “shared content visibility” (e.g. flags on organization profile or separate settings API).
- Add Redux/state and API (e.g. get/update visibility settings).
- Wire **SharedContentVisibilityTab** to real data and persist changes on save.

**Step 4.3 – Organization profile in Profile.jsx**
- Ensure when `activeDashboard === "organization"`, Profile loads and uses organization context where needed:
  - e.g. fetch `orgProfile` (already available via `getMyOrganizationProfile` in Workspace) and pass into Profile if needed for Subscription, Shared Content Visibility, or extended Personal Information.
- Avoid duplicate fetches; prefer passing `orgProfile` from Workspace/PageRender into Profile if possible, or read from Redux inside Profile.

---

### Phase 5: Polish and edge cases

**Step 5.1 – Tab visibility and default tab**
- On first load of Profile as organization, default `tabValue` to 0 (Subscription) or per product preference.
- Ensure when switching from another dashboard to organization, tab state does not show a wrong tab (e.g. index 2 might mean different things for user vs org); reset to 0 for organization if needed.

**Step 5.2 – Responsive behavior**
- Subscription and Shared Content Visibility layouts should be responsive (stack columns on small screens) per Figma or design system.
- Personal Information and Change Password: ensure existing responsive behavior still works with new content.

**Step 5.3 – Loading and error states**
- Each new tab (Subscription, Shared Content Visibility) should show loading state while data is fetched and a simple error state if fetch fails.
- Buttons (e.g. Renew Subscription, Save) should show loading state and disable during submit.

**Step 5.4 – Testing and regression**
- Test organization Profile: all 4 tabs render and switch correctly.
- Test user (and creator/admin) Profile: no regression; correct tabs and content for each dashboard.
- Test Personal Information: existing user/creator flows still work; organization sees and can save new fields.
- Test Change Password for organization (reuse existing flow).

---

## File and component summary

| Item | Action |
|------|--------|
| `ProfileTabs.jsx` | Add organization branch: 4 tabs (Subscription, Shared Content Visibility, Personal Information, Change Password). |
| `ProfileTabContent.jsx` | Add organization branch: map tabValue 0–3 to SubscriptionTab, SharedContentVisibilityTab, PersonalInfoForm, PasswordForm. |
| `Profile.jsx` | Handle org tabValue and submit logic; pass orgProfile if needed; extend formData for org Personal Information if required. |
| **New** `SubscriptionTab.jsx` | Subscription tab UI and, later, data/API. |
| **New** `SharedContentVisibilityTab.jsx` | Shared Content Visibility tab UI and, later, data/API. |
| `PersonalInfoForm.jsx` | Extend with org-only sections/fields per Figma; keep user/creator behavior unchanged. |
| **Unchanged for org** | `PasswordForm.jsx` (reused as-is). |
| **Removed from org view only** | Social Account and Educational Information tabs (no longer rendered when dashboard is organization). |

---

## Figma reference
- **Main node (Profile section, 4 tabs):** [Figma 951-71039](https://www.figma.com/design/AaxMqCjwNc6tsZHpEZsUWi/Career-Explorer?node-id=951-71039&m=dev)
- For implementation, use **get_design_context** (or **get_screenshot**) on this node and on child nodes for **Subscription**, **Shared Content Visibility**, and **Personal Information** to match layout, typography, and colors.

---

## Implementation order (recommended)
1. Phase 1 (Steps 1.1–1.3) – tab structure and routing.
2. Phase 2 (Steps 2.1–2.3) – new tab components with static/placeholder content.
3. Phase 3 (Steps 3.1–3.4) – extend Personal Information and wire save.
4. Phase 4 – data and API for Subscription and Shared Content Visibility.
5. Phase 5 – polish, responsive, loading/error, and regression testing.

No code implementation is done in this document; this is a planning artifact only.
