# Backend Brief: Add Service Form Changes (Connect 1-2-1)

## Context
The org dashboard **Add Service** flow has been renamed to **Add Call** (Connect 1-2-1). The form is simplified and now supports two organization types (ESP vs HEI) with different category lists. The API for **creating** and **updating** services should be updated to align with the new payload and to support the new field.

---

## Endpoints Affected
- **POST** `/api/services/` — create service
- **PUT** `/api/services/:id` — update service

Request content type: **multipart/form-data** (unchanged).

---

## New Field

| Field         | Type   | Required | Description                                      |
|---------------|--------|----------|--------------------------------------------------|
| **calendarLink** | string | Yes      | Link to appointment calendar (e.g. Calendly URL). |

- Accept and persist `calendarLink` on create/update.
- Return `calendarLink` in service GET responses (e.g. service by ID, list my services) so the edit form can pre-fill it.

---

## Payload Changes (What the Frontend Sends)

### Still sent (same as before)
- **description** (string, required)
- **category** (string, required) — see Category values below
- **referenceNumber** (string, optional)
- **serviceMode** (string) — `"ONLINE"` or `"OFFLINE"` (In-Person). **Hybrid is no longer sent** from this form.
- **whatsIncluded** (JSON string array)
- **cta** (JSON object: `{ type, value, label }`)
- **status** (e.g. `"PUBLISHED"`)
- **file** (optional) — cover image

### New
- **calendarLink** (string, required from this form)

### Sent with fixed/default values (no longer user-editable in this form)
- **title** — frontend sends the selected **category** value as the title (for display/API compatibility). Backend can keep storing it as-is or derive it from category.
- **priceType** — always `"FREE"`
- **duration** — always `{ "value": 1, "unit": "weeks" }`
- **whatYouWillLearn** — always `[]` (empty array)

### No longer sent from this form
- User no longer submits: custom title, price, currency, or duration. If your API requires them, the frontend sends the defaults above.

---

## Category Values

Category is **required** and must be one of the following, depending on organization type.

**ESP (Education Service Provider):**
- Building your Career Plan
- Education options
- Financing your studies
- Career readiness
- Planning your future
- Where can I study?
- General advice

**HEI (Higher Education Institution):**
- Ask Admissions
- Ask Financial Aid
- Ask Faculty
- Student chat

Backend should accept and store the category string as sent. Optionally validate against the above lists per organization type.

---

## Validation Summary (Frontend)

- **Required:** description, category, serviceMode, calendarLink, cta value (link or email).
- **Optional:** referenceNumber, cover image, whatsIncluded.
- **Limits:** description max 3000 chars; whatsIncluded total content max 3000 chars (frontend enforces).

Backend can add its own validation (e.g. URL format for calendarLink, non-empty strings where required).

---

## Response / GET Service

For **GET** service (by ID or in list), include **calendarLink** in the response so the Add/Edit Call form can display and submit it. Example:

```json
{
  "_id": "...",
  "title": "...",
  "description": "...",
  "category": "Building your Career Plan",
  "calendarLink": "https://calendly.com/...",
  "serviceMode": "ONLINE",
  "referenceNumber": "...",
  "whatsIncluded": [],
  "cta": { "type": "LINK", "value": "...", "label": "Book Slot" },
  ...
}
```

---

## Summary Checklist for Backend

1. Add **calendarLink** to the service model (string, optional or required as per product).
2. Accept **calendarLink** in POST and PUT payloads and persist it.
3. Return **calendarLink** in all service responses (by ID, list my services, etc.).
4. Accept the simplified payload: fixed **priceType** (FREE), **duration** (1 week), **whatYouWillLearn** ([]), and **title** = category when sent that way.
5. Optionally validate **category** against ESP/HEI lists and **serviceMode** as ONLINE or OFFLINE for this flow.
