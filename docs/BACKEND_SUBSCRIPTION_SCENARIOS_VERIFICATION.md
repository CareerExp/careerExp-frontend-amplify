# Backend Verification: Organization Subscription Scenarios

**Audience:** Backend team / backend AI agent  
**Purpose:** Confirm that the backend correctly supports all subscription states and scenarios so the frontend can show the right UI (Profile → Subscription tab and dashboard gating).

---

## 1. Subscription Data the Frontend Expects

The frontend reads subscription state from the **organization profile** (e.g. `GET /api/organization/profile/me` or `GET /api/profile/:userId` with `organization.subscription`). It expects a **subscription** object with at least:

| Field | Type | Purpose |
|-------|------|---------|
| `status` | string | One of: `none`, `active`, `past_due`, `canceled`, `trialing`, `incomplete`, `incomplete_expired` |
| `currentPeriodStart` | ISO date string or null | Start of current billing period |
| `currentPeriodEnd` | ISO date string or null | End of current billing period (next billing date when active) |
| `cancelAtPeriodEnd` | boolean | True if user cancelled but access continues until `currentPeriodEnd` |
| `stripeSubscriptionId` | string (optional for UI) | For Stripe Customer Portal or support |
| `stripeCustomerId` | string (optional for UI) | For Stripe Customer Portal or support |

**Action for backend:** Confirm that every response that returns org/profile data for an organization user includes this `subscription` object and that it is kept in sync with Stripe via webhooks.

---

## 2. Five Scenarios to Support

The frontend will show different content in the **Subscription tab** (and gate the org dashboard) based on these scenarios. For each scenario, verify backend support as indicated.

---

### Scenario 1: User has an active subscription

**User state:** Subscribed; payment is in good standing; next billing date in the future.

**Required backend behavior:**

- When Stripe has an active (or trialing) subscription and the current period has not ended:
  - Store/return `subscription.status === 'active'` (or `'trialing'`).
  - Populate `currentPeriodEnd` (next billing date) and optionally `currentPeriodStart`.
  - Set `cancelAtPeriodEnd === false` (or omit if not cancelled).

**Stripe:** Subscription is `active` (or `trialing`). `invoice.paid` and `customer.subscription.updated` fire on success/renewal.

**Verification checklist for backend:**

- [ ] Webhook `invoice.paid` (and/or `customer.subscription.updated`) updates the organization’s subscription record with `status: 'active'` and latest `current_period_end` / `current_period_start`.
- [ ] `GET /api/organization/profile/me` (or the endpoint used for org profile) returns `subscription: { status: 'active', currentPeriodEnd: '...', currentPeriodStart: '...', cancelAtPeriodEnd: false, ... }`.
- [ ] After successful checkout, the org’s subscription is updated (e.g. via `checkout.session.completed`) so the frontend sees `active` and can show “Your Current Plan” and next billing date.

---

### Scenario 2: User’s subscription has expired

**User state:** Subscription was cancelled or payment failed and retries exhausted; the current period has ended; user no longer has access.

**Required backend behavior:**

- When the subscription has ended (Stripe subscription is `canceled` or deleted, and the period end date is in the past):
  - Return `subscription.status === 'canceled'` (or a dedicated value like `'none'`/`'expired'` if you use it).
  - Frontend will treat this as “no access” and show “Subscribe again” (same flow as no subscription).

**Stripe:** Subscription status `canceled`; or subscription deleted (`customer.subscription.deleted`). Period end is in the past.

**Verification checklist for backend:**

- [ ] Webhook `customer.subscription.deleted` (and/or `customer.subscription.updated` when status becomes `canceled`) updates the organization’s subscription so that `status` is `'canceled'` (or your chosen “expired” value).
- [ ] When the subscription has ended, the API still returns the `subscription` object (so frontend can show “expired” state and “Subscribe again”), e.g. `status: 'canceled'`, and optionally `currentPeriodEnd` in the past.
- [ ] Dashboard gating: frontend uses `status === 'active' || status === 'trialing'` for access; `canceled`/`none`/`expired` correctly deny access. Confirm your status values align.

---

### Scenario 3: Auto payment failed; user is in grace period (e.g. 7 days before expiry)

**User state:** Latest invoice payment failed; Stripe is retrying (or in dunning/grace); subscription not yet cancelled.

**Required backend behavior:**

- When Stripe reports that the subscription is in a “payment failed, retrying” state:
  - Store/return `subscription.status === 'past_due'`.
  - Keep `currentPeriodEnd` (and optionally `currentPeriodStart`) so the frontend can show “Subscription at risk” or “Update payment method by …”.

**Stripe:** Subscription status `past_due`. Events: `invoice.payment_failed`, `customer.subscription.updated` (status `past_due`).

**Verification checklist for backend:**

- [ ] Webhook `invoice.payment_failed` (and/or `customer.subscription.updated` when status becomes `past_due`) updates the organization’s subscription to `status: 'past_due'`.
- [ ] `currentPeriodEnd` (and optionally `currentPeriodStart`) remain set so the frontend can show when the period ends.
- [ ] API response for org profile includes `subscription: { status: 'past_due', currentPeriodEnd: '...', ... }`. Frontend will show “Update payment method” / “Pay now” and may still allow dashboard access until you decide otherwise (or you can treat `past_due` as no access if product requirement is strict).

---

### Scenario 4: Auto payment failed; user did not retry; subscription has expired

**User state:** Same as Scenario 2: subscription is over; user must buy a new subscription.

**Required backend behavior:**

- Same as Scenario 2: return `subscription.status === 'canceled'` (or `'none'`/`'expired'`). Frontend shows “Subscribe again” and uses the same checkout flow as “no subscription”.

**Stripe:** After retries exhausted or subscription cancelled, status becomes `canceled` (or subscription deleted). Period end in the past.

**Verification checklist for backend:**

- [ ] When Stripe moves the subscription to `canceled` or deletes it (e.g. after failed retries), your webhook handler sets the stored status to `'canceled'` (or your chosen “expired” value).
- [ ] No extra API is required beyond the same subscription object as in Scenario 2; frontend only needs to know “no active subscription” to show “Subscribe again”.

---

### Scenario 5: User cancelled subscription, but current period has not ended yet

**User state:** User chose “Cancel subscription”; Stripe will stop renewal at the end of the current period; access continues until `currentPeriodEnd`.

**Required backend behavior:**

- When the user cancels at period end in Stripe (`cancel_at_period_end === true`):
  - Keep `subscription.status === 'active'` until the period actually ends (Stripe keeps it `active` until then).
  - Set `subscription.cancelAtPeriodEnd === true`.
  - Keep `currentPeriodEnd` as the exact date when access ends.

**Stripe:** Subscription remains `active` with `cancel_at_period_end: true`; `current_period_end` is the last day of access. Event: `customer.subscription.updated`.

**Verification checklist for backend:**

- [ ] Webhook `customer.subscription.updated` reads `cancel_at_period_end` and `current_period_end` and persists them (e.g. `cancelAtPeriodEnd: true`, `currentPeriodEnd: '<date>'`).
- [ ] API returns `subscription: { status: 'active', cancelAtPeriodEnd: true, currentPeriodEnd: '...', ... }` so the frontend can show “Your subscription will end on {date}” and optionally “Resubscribe” CTA.
- [ ] After the period ends, Stripe will set status to `canceled` (or delete); your webhook then updates to `status: 'canceled'` as in Scenario 2.

---

## 3. Webhook Summary (for quick reference)

Please confirm your Stripe webhook handler does the following:

| Event | Backend action (to support scenarios above) |
|-------|--------------------------------------------|
| `checkout.session.completed` | Create/link subscription; set `status: 'active'`; set `stripeCustomerId`, `stripeSubscriptionId`; set period dates from subscription. |
| `invoice.paid` | Update `currentPeriodStart` / `currentPeriodEnd` (and keep `status: 'active'`). |
| `invoice.payment_failed` | Set `status: 'past_due'` (Scenario 3). |
| `customer.subscription.updated` | Update `status`, `currentPeriodStart`, `currentPeriodEnd`, `cancelAtPeriodEnd` (Scenarios 1, 3, 5). |
| `customer.subscription.deleted` | Set `status: 'canceled'` (Scenarios 2, 4). |

**Verification:**

- [ ] All of the above events are subscribed in Stripe and handled in your webhook.
- [ ] Webhook updates the **same** organization subscription document/record that is returned by `GET /api/organization/profile/me` (or the profile endpoint used for org users).

---

## 4. Optional: Actions the Frontend May Call Later

Not required for the five scenarios above, but the frontend may later need:

- **Stripe Customer Portal URL** (for “Update payment method”, “View payment history”, “Cancel subscription”): backend endpoint that creates a Stripe billing portal session using `stripeCustomerId` and returns `{ url }` for redirect. Confirm if this exists or is planned.
- **Cancel subscription:** Either via Customer Portal, or an API that sets Stripe subscription to `cancel_at_period_end` (or cancels immediately). Confirm if supported.

No need to implement these for the initial scenario verification; just note whether they exist or are planned.

---

## 5. Response Format for Verification

Backend team / AI can respond with something like:

1. **Scenario 1 (active):** Supported yes/no; which webhooks update status/period; which endpoint returns `subscription`.
2. **Scenario 2 (expired):** Supported yes/no; how `canceled`/expired is stored and returned.
3. **Scenario 3 (past_due / grace):** Supported yes/no; which webhook sets `past_due`; whether `currentPeriodEnd` is returned.
4. **Scenario 4 (expired after no retry):** Same as Scenario 2; confirm.
5. **Scenario 5 (cancel at period end):** Supported yes/no; whether `cancelAtPeriodEnd` and `currentPeriodEnd` are stored and returned.
6. **Webhooks:** List of events handled and which fields are updated on the organization subscription.
7. **Profile endpoint:** Exact endpoint(s) that return `subscription` for an org user and confirmation that it includes all required fields for the five scenarios.

If anything is missing, list the gap and the change needed (e.g. “add handling for `invoice.payment_failed` to set `status: 'past_due'`”).

---

*This document is for backend verification only. Frontend will implement Subscription tab states based on the confirmed `subscription` shape and status values.*
