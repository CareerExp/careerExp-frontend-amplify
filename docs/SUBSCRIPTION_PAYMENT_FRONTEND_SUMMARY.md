# Organization Subscription Payment – Frontend Implementation Summary

Summary for backend: how the frontend uses the subscription APIs and what it expects.

---

## 1. API Used by Frontend

### Create subscription checkout session

| Item | Detail |
|------|--------|
| **Method** | `POST` |
| **URL** | `/api/payment/create-subscription-checkout-session` |
| **Auth** | `Authorization: Bearer <token>` (frontend always sends the logged-in user’s JWT) |
| **Request body** | `{ "organizationId": "<string>", "organizationType": "ESP" \| "HEI" }` |

**Source of request data**

- `organizationId`: from logged-in user profile → `user.organization.organizationId`
- `organizationType`: from `user.organization.organizationType` or, if missing, from org profile → `orgProfile.organizationType` (from `GET /api/organization/profile/me`)

**Success response handling**

- Frontend accepts either shape:
  - `{ "url": "https://checkout.stripe.com/..." }`
  - `{ "data": { "url": "https://checkout.stripe.com/..." } }`
- On success, frontend does: `window.location.href = url` (full redirect to Stripe Checkout).

**Error handling**

- Non‑2xx or thrown error: frontend shows a generic error message (e.g. “Could not start checkout. Please try again.”) and does not redirect.

---

## 2. Redirect URLs (Stripe Checkout success/cancel)

Backend must configure Stripe Checkout so that after payment:

- **Success:** redirect to **`{FRONTEND_ORIGIN}/subscription-success?session_id={CHECKOUT_SESSION_ID}`**
- **Cancel:** redirect to **`{FRONTEND_ORIGIN}/subscription-cancelled`**

Frontend routes:

| Path | Purpose |
|------|--------|
| `/subscription-success` | Subscription success page; shows “Subscription Active”, refetches org profile, button “Go to Dashboard” → `/workspace/:userId` |
| `/subscription-cancelled` | Checkout cancelled page; shows “Checkout Cancelled”, button “Please Try Again” → back to workspace with subscription tab open |

`FRONTEND_ORIGIN` is the app’s public base URL (e.g. `https://app.example.com`). It must match where these routes are served.

---

## 3. Where “Proceed to Payment” Is Used

1. **Org subscription required screen**  
   - Full-page screen when org is approved but has no active/trialing subscription.  
   - Button **“Proceed to Payment”** → calls `POST .../create-subscription-checkout-session` with auth and org data → redirects to `response.url` (Stripe Checkout).

2. **Profile → Subscription tab**  
   - Organization Profile, first tab (“Subscription”).  
   - Button **“Proceed to Payment”** → same API call and redirect to Stripe Checkout.

In both cases the user is sent to Stripe Hosted Checkout; no in-app payment form.

---

## 4. Subscription Status (for gating and UI)

- **Gating:** Organization dashboard content is only shown if `orgProfile.subscription.status` is `active` or `trialing`. Otherwise the “subscription required” full-page screen is shown.
- **Source of subscription data:** Frontend currently uses org profile from **`GET /api/organization/profile/me`**. For gating to work, that response must include a `subscription` object (e.g. `status`, `currentPeriodEnd`, `cancelAtPeriodEnd`, etc.). If subscription is only returned from `GET /api/profile/:userId` under `organization.subscription`, then either:
  - Backend also returns `subscription` from `GET /api/organization/profile/me`, or
  - Frontend will need to use/merge profile data from `GET /api/profile/:userId` where it checks subscription.

---

## 5. Separation from Product (Assessment) Payment

- **Product payment** (e.g. Career Direction Report) is unchanged:
  - **Endpoint:** `POST /api/payment/create-checkout-session` (body: `userId`, optional `couponCode`).
  - **Success/cancel routes:** `/payment-successful`, `/payment-cancelled`.
- **Subscription payment** uses:
  - **Endpoint:** `POST /api/payment/create-subscription-checkout-session` (body: `organizationId`, `organizationType`).
  - **Success/cancel routes:** `/subscription-success`, `/subscription-cancelled`.

No overlap in endpoints or redirect paths.

---

## 6. Quick Reference for Backend

- **Subscription checkout:** `POST /api/payment/create-subscription-checkout-session` with `Authorization: Bearer <token>`, body `{ organizationId, organizationType }`.
- **Success response:** Return `{ url: "<stripe_checkout_url>" }` (or `{ data: { url: "..." } }`); frontend redirects the browser to that URL.
- **Stripe redirects:** Set success URL to `{HOST}/subscription-success?session_id={CHECKOUT_SESSION_ID}` and cancel URL to `{HOST}/subscription-cancelled`, where `HOST` is the frontend origin.
- **Subscription data:** If org dashboard and “subscription required” logic are to work, the response of `GET /api/organization/profile/me` (or the profile endpoint used for org users) should include `subscription` with at least `status` (`active` / `trialing` for access).

---

*Document generated from frontend implementation; backend can use it to align APIs and redirect configuration.*
