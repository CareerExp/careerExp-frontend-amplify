# Repository Context: careerExp-frontend-amplify

## 1. Repository Purpose
This repository serves as the frontend application for the **Career Explorer** platform. It provides a comprehensive user interface for students, career counselors/creators, and administrators.

**Key Responsibilities:**
- Delivering the UI/UX for all user roles (User, Creator, Admin).
- Managing client-side routing and protected access.
- Facilitating career assessments (Interest Profiler, DISC, Survey).
- Providing a multi-step Resume Builder interface.
- Enabling video content exploration, search, and consumption.
- Handling client-side PDF generation for career assessment reports.
- Managing user profile and dashboard interactions.

**Explicitly NOT Owned:**
- Backend business logic and data persistence (delegated to `career-explorer-backend`).
- Direct database operations.
- External API integrations with O*NET and Zyla Labs (consumed via backend endpoints).
- Payment processing logic (orchestrated via backend with Stripe).
- Authentication token generation.

## 2. Tech Stack
- **Framework:** React 18.2.0
- **Build Tool:** Vite 5.2.0
- **Runtime:** Browser-based execution (Node.js used for development and build).
- **State Management:** Redux Toolkit with `redux-persist` for session persistence.
- **Routing:** React Router DOM 6.22.3.
- **UI Libraries:** 
  - Material-UI (MUI) 5.15.15 for core components.
  - Emotion for styling.
  - React Icons for iconography.
  - React Slick for carousels and sliders.
- **Data Visualization:** ECharts (via `echarts-for-react`) for assessment result graphs.
- **Data Fetching:** React Query 3.39.3 and a custom `FetchApi` wrapper (`src/client.js`).
- **PDF Generation:** `@react-pdf/renderer`, `html2pdf.js`, `jspdf`, and `pdf-lib`.
- **External Services:** EmailJS for client-side email triggers.

## 3. Folder Structure Overview
- `/src/assets/`: Static assets including feature-specific images and icons.
- `/src/components/`: Reusable UI components, organized by feature area (e.g., `adminDashboard`, `creatorDashboard`, `resumeBuilder`, `userDashboard`).
- `/src/config/`: Configuration files (e.g., `config.js` for API environment variables).
- `/src/loaders/`: Loading indicators and shimmer components for better UX.
- `/src/models/`: Modal and popup components (internally referred to as "models").
- `/src/pages/`: Page-level components representing major application views.
- `/src/redux/`: Redux store configuration and feature-specific slices (`slices/`).
- `/src/routes/`: Routing definitions, including `ProtectedRoute` and `AppRoutes`.
- `/src/styles/`: Global CSS and CSS modules.
- `/src/utility/`: Helper functions, constants, validation logic, and the central `FetchApi` client.

## 4. Key Modules and Flows
- **Authentication Flow:** Users register and log in via the backend. The JWT token is stored in the Redux `auth` slice and persisted to `localStorage`.
- **Assessment Flow:** 
  - **Interest Profiler:** Interactive assessment fetching career data via O*NET (backend).
  - **DISC & Survey:** Custom assessments with results stored in the `unifiedRecord`.
- **Report Generation Flow:** Client-side generation of "Career Directions Reports" (CDR) using `html2pdf.js`. It merges multiple PDF sections and provides both local download and AWS S3 upload capabilities (via backend).
- **Resume Builder Flow:** A multi-step interface for building, previewing, and downloading resumes with template selection.
- **Video Exploration Flow:** Public and authenticated access to career guidance videos with search, category filtering, and rating systems.
- **Creator Dashboard:** Interface for creators to upload videos, manage content, and view analytics.

## 5. API Integration Points
- **Internal Service Layer:** `src/client.js` provides a `FetchApi.fetch()` wrapper that handles base URLs, JSON parsing, and standardized error handling.
- **Backend API:** Consumes a RESTful API (configured via `VITE_REACT_APP_API`).
- **Redux Thunks:** Most API interactions are managed within Redux slices using `createAsyncThunk`.
- **Stripe Integration:** Uses `@stripe/react-stripe-js` to handle frontend payment elements, with backend coordination for session creation and verification.

## 6. Authentication Handling
- **Mechanism:** JWT-based authentication.
- **Storage:** Tokens are stored in the Redux `auth` slice, persisted via `redux-persist` to `localStorage` under the key `persist:user`.
- **Request Handling:** The `FetchApi` wrapper automatically includes the `Authorization: Bearer <token>` header for all requests to the configured API.
- **Session Management:** 
  - `401 Unauthorized` responses trigger an automatic logout, clearing persistent state and redirecting to `/login?sessionExpired=true`.
  - `403 Forbidden` responses trigger an alert and redirect to the home page.
- **Protection:** `ProtectedRoute.jsx` wraps routes requiring authentication, redirecting unauthenticated users to the login page.

## 7. State Management Approach
- **Tool:** Redux Toolkit (RTK).
- **Pattern:** Centralized store with feature-based slices in `src/redux/slices/`.
- **Persistence:** `redux-persist` is used to maintain the `auth` state across browser refreshes. Other state (like `explore` or `assessment` results) is generally in-memory and re-fetched as needed.
- **Alerting:** A dedicated `alert` slice manages application-wide notifications using `react-hot-toast`.

## 8. Known TODOs, Gaps, or Incomplete Flows
- No explicit `TODO` or `FIXME` comments are currently visible in the main codebase.
- **Assumption:** Admin approval for creators is handled through an admin dashboard, but the full approval workflow (rejection, suspension) may still be in development as seen by "pending" states in user models.
- **Assumption:** Refresh token logic is not implemented; sessions depend on the 7-day expiration of the primary access token.
