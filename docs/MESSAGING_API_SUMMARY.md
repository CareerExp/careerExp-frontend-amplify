# Messaging API – Feature Summary for Frontend

This document describes the one-to-one messaging feature for the Career Explorer backend so a frontend (or frontend AI agent) can integrate with it.

---

## 1. Feature brief

- **Purpose:** In-app messaging for enquiries and issue discussions (inbox-style, not live chat).
- **Behaviour:**
  - **User-only:** Sent and received lists are always for the **logged-in user**. There is no “organization inbox” or “acting as org” for messaging.
  - **Two tabs:** **Received** (messages where the user is the receiver) and **Sent** (messages where the user is the sender). No conversation threads; each message is a standalone item.
  - **Plain text only:** Title + body. No attachments, images, or documents.
  - **Limits:** Title max 200 characters; body max 4000 characters.
  - **Recipients:** The sender can address a **User** (any role: user, creator, admin) or an **Organization** (by OrganizationProfile `_id`). The backend resolves display names and sends an email to the receiver when a message is sent.
- **Not included:** No real-time (no WebSockets), no in-app notifications module, no group chats, no read receipts. The receiver is notified by **email** and reads messages when opening the “My messages” area in the app.

---

## 2. Implementation details (backend)

- **Auth:** All messaging endpoints require a valid JWT. Send `Authorization: Bearer <token>` (same as rest of the app). The backend uses `req.user._id` as the sender for “send” and as the scope for “received” and “sent” lists.
- **Models:** A single **Message** model with:
  - `senderType`: `'User'` | `'Organization'` (for send we always use `'User'` and `req.user._id`)
  - `senderId`: ObjectId (User or OrganizationProfile)
  - `receiverType`: `'User'` | `'Organization'`
  - `receiverId`: ObjectId (User or OrganizationProfile)
  - `title`: string, max 200
  - `body`: string, max 4000
  - `createdAt` / `updatedAt`: timestamps
- **Display names:** The API returns `fromDisplayName` (for received/single message) and `toDisplayName` (for sent/single message). For a User this is `firstName + lastName` or email; for an Organization it is `organizationName`.
- **Email:** When a message is sent, the backend sends one email to the receiver (User’s email or Organization’s contact/owner email). Email failure does not fail the send; the API still returns success.

---

## 3. Base URL and auth

- **Base URL:** Same as rest of API (e.g. from `VITE_REACT_APP_API`).
- **Auth:** All routes under `/api/messages` require authentication.  
  **Header:** `Authorization: Bearer <access_token>`

---

## 4. API routes

### 4.1 List received messages

**GET** `/api/messages/received`

Returns messages where the logged-in user is the **receiver** (user-only: `receiverType === 'User'` and `receiverId === req.user._id`), newest first.

**Request**

- **Headers:** `Authorization: Bearer <token>`
- **Query (optional):**
  - `page` (number, default `1`)
  - `limit` (number, default `20`, max `100`)

**Response (200)**

```json
{
  "success": true,
  "message": "Received messages fetched successfully.",
  "data": {
    "messages": [
      {
        "_id": "<message ObjectId>",
        "senderType": "User",
        "senderId": "<ObjectId>",
        "receiverType": "User",
        "receiverId": "<ObjectId>",
        "title": "Message title",
        "body": "Plain text body.",
        "createdAt": "<ISO date>",
        "updatedAt": "<ISO date>",
        "fromDisplayName": "Jane Doe"
      }
    ],
    "total": 42,
    "currentPage": 1,
    "totalPages": 3
  }
}
```

- **Received list:** Each item has `fromDisplayName` (sender’s display name). Sender can be User or Organization.

**Error responses**

- `401`: Missing or invalid token.
- `500`: `{ "success": false, "message": "...", "error": "..." }`

---

### 4.2 List sent messages

**GET** `/api/messages/sent`

Returns messages where the logged-in user is the **sender** (user-only: `senderType === 'User'` and `senderId === req.user._id`), newest first.

**Request**

- **Headers:** `Authorization: Bearer <token>`
- **Query (optional):** Same as received — `page`, `limit` (default 20, max 100).

**Response (200)**

```json
{
  "success": true,
  "message": "Sent messages fetched successfully.",
  "data": {
    "messages": [
      {
        "_id": "<message ObjectId>",
        "senderType": "User",
        "senderId": "<ObjectId>",
        "receiverType": "Organization",
        "receiverId": "<ObjectId>",
        "title": "Enquiry about courses",
        "body": "Plain text body.",
        "createdAt": "<ISO date>",
        "updatedAt": "<ISO date>",
        "toDisplayName": "Career Support Org"
      }
    ],
    "total": 10,
    "currentPage": 1,
    "totalPages": 1
  }
}
```

- **Sent list:** Each item has `toDisplayName` (receiver’s display name). Receiver can be User or Organization.

**Error responses**

- `401`: Missing or invalid token.
- `500`: `{ "success": false, "message": "...", "error": "..." }`

---

### 4.3 Send message

**POST** `/api/messages`

Creates a message from the logged-in user to the given recipient (User or Organization) and triggers an email to the receiver.

**Request**

- **Headers:**
  - `Authorization: Bearer <token>`
  - `Content-Type: application/json`
- **Body (JSON):**

| Field   | Type   | Required | Description |
|--------|--------|----------|-------------|
| `toType` | string | Yes | `"User"` or `"Organization"` |
| `toId`   | string | Yes | MongoDB ObjectId of the User or OrganizationProfile to receive the message |
| `title`  | string | Yes | Subject/title of the message; max 200 characters |
| `body`   | string | Yes | Plain text body; max 4000 characters |

**Example request body**

```json
{
  "toType": "User",
  "toId": "507f1f77bcf86cd799439011",
  "title": "Question about my report",
  "body": "Hi, I wanted to ask about the career direction report I purchased..."
}
```

**Response (201)**

```json
{
  "success": true,
  "message": "Message sent successfully.",
  "data": {
    "_id": "<message ObjectId>",
    "senderType": "User",
    "senderId": "<current user ObjectId>",
    "receiverType": "User",
    "receiverId": "<ObjectId>",
    "title": "Question about my report",
    "body": "Hi, I wanted to ask...",
    "createdAt": "<ISO date>",
    "updatedAt": "<ISO date>"
  }
}
```

**Error responses**

- `400`: Validation error, e.g. missing/invalid `toType`, `toId`, `title`, or `body`; title/body over limit.  
  Example: `{ "success": false, "message": "Title is required.", "field": "title" }`  
  Body length: `"Message body must be at most 4000 characters."` with `"field": "body"`.
- `401`: Missing or invalid token.
- `404`: Recipient not found.  
  `{ "success": false, "message": "Recipient user not found.", "field": "toId" }` or `"Recipient organization not found."`
- `500`: `{ "success": false, "message": "...", "error": "..." }`

---

### 4.4 Get single message

**GET** `/api/messages/:id`

Returns one message by id. Allowed only if the logged-in user is the **sender** or the **receiver** (user-only).

**Request**

- **Headers:** `Authorization: Bearer <token>`
- **Params:** `id` — message ObjectId.

**Response (200)**

```json
{
  "success": true,
  "message": "Message fetched successfully.",
  "data": {
    "_id": "<message ObjectId>",
    "senderType": "User",
    "senderId": "<ObjectId>",
    "receiverType": "User",
    "receiverId": "<ObjectId>",
    "title": "Message title",
    "body": "Full plain text body.",
    "createdAt": "<ISO date>",
    "updatedAt": "<ISO date>",
    "fromDisplayName": "Jane Doe",
    "toDisplayName": "John Smith"
  }
}
```

**Error responses**

- `400`: Invalid `id`. `{ "success": false, "message": "Invalid message id.", "field": "id" }`
- `401`: Missing or invalid token.
- `404`: Message not found or user is not sender/receiver. `{ "success": false, "message": "Message not found." }`
- `500`: `{ "success": false, "message": "...", "error": "..." }`

---

## 5. Summary table

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/messages/received` | List messages received by the logged-in user (paginated). |
| GET | `/api/messages/sent` | List messages sent by the logged-in user (paginated). |
| POST | `/api/messages` | Send a new message (body: `toType`, `toId`, `title`, `body`). |
| GET | `/api/messages/:id` | Get one message (only if user is sender or receiver). |

All require `Authorization: Bearer <token>`.

---

## 6. Frontend integration notes

- **Received vs Sent:** Use **GET** `/api/messages/received` and **GET** `/api/messages/sent` for the two tabs. Same pagination contract: `data.messages`, `data.total`, `data.currentPage`, `data.totalPages`.
- **Sending:** To show “To” correctly, the frontend needs a way to resolve recipients (e.g. search users/organizations from existing APIs or a future recipients endpoint). Send the chosen recipient as `toType` + `toId` in **POST** `/api/messages`.
- **Display:** Use `fromDisplayName` on received items and “To” detail view; use `toDisplayName` on sent items and “From” detail view. For **GET** `/api/messages/:id`, both `fromDisplayName` and `toDisplayName` are present.
- **Errors:** Use `success === false`, `message`, and optional `field` for validation; 404 for not found / not participant. Follow the same error handling as the rest of the app (e.g. 401 → re-login).
- **No real-time:** Poll or refetch when the user opens the messages screen or switches tabs; no WebSockets.
