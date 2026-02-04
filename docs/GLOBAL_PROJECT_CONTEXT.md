# Global Project Context

## 1. Project Overview

### Problem Statement
The system is a Career Explorer platform that helps students and users discover career paths, take assessments, build resumes, and access educational video content from career counselors/creators.

### Primary User Roles
- **User/Student**: Regular users who can take assessments, build resumes, explore videos, and access career planning resources
- **Creator/Counsellor**: Content creators who upload educational videos and provide career guidance
- **Admin**: System administrators with elevated permissions

### Core Functionality
- User authentication and profile management
- Career assessments (Interest Profiler, DISC, Survey)
- Video content exploration and consumption
- Resume builder
- Payment processing for premium reports (Career Direction Report)
- Career planning and recommendations
- Integration with external services (O*NET, Zyla Labs)

---

## 2. Repository Responsibilities

### FRONTEND Repository
**Location**: `FRONTEND/careerExp-frontend-amplify/`

**Technology Stack**:
- React 18.2.0
- Vite (build tool)
- Redux Toolkit with Redux Persist
- React Router DOM
- Material-UI (MUI)
- React Query

**What It Owns**:
- All UI components and pages
- Client-side routing
- Redux state management
- API client wrapper (`client.js`)
- Frontend configuration (`config.js` - reads from `VITE_REACT_APP_API` and `VITE_REACT_APP_DOMAIN`)
- User interface state and interactions
- Protected route logic
- PDF generation for assessment reports (client-side)

**What It Depends On**:
- Backend API endpoints (configured via `VITE_REACT_APP_API` environment variable)
- Backend authentication tokens (JWT stored in Redux state)
- Backend domain for redirects (configured via `VITE_REACT_APP_DOMAIN`)

**What It Does NOT Own**:
- Backend business logic
- Database operations
- Authentication token generation
- Payment processing (uses Stripe via backend)
- External API integrations (O*NET, Zyla)

### BACKEND Repository
**Location**: `BACKEND/career-explorer-backend/`

**Technology Stack**:
- Node.js 20.*
- Express.js
- MongoDB (via Mongoose)
- JWT for authentication
- Stripe for payments
- AWS S3 for file storage
- Redis (configured but connection commented out)
- Python scripts (for ML/recommendations via `ceml` service)

**What It Owns**:
- All API endpoints and routes
- Database models and schemas
- Authentication and authorization middleware
- Business logic in controllers
- External service integrations (O*NET, Zyla, transcription)
- Payment processing with Stripe
- File upload handling (S3)
- Email sending (NodeMailer)
- Python ML services for recommendations

**What It Depends On**:
- MongoDB database (configured via `MONGO` environment variable)
- Redis (configured but not actively used - connection code commented out)
- AWS S3 for file storage
- Stripe API for payments
- O*NET API for career data
- Zyla Labs API for university data
- NodeMailer SMTP server for emails

**What It Does NOT Own**:
- Frontend UI/UX
- Client-side state management
- Frontend routing
- Client-side PDF generation

---

## 3. System Architecture

### Communication Pattern
- **Frontend → Backend**: HTTP REST API calls
- **Protocol**: JSON over HTTP/HTTPS
- **Authentication**: JWT tokens sent in `Authorization` header as `Bearer <token>`
- **CORS**: Enabled with credentials support (allows cookies)

### Data Flow Direction
1. **User Actions** → Frontend Redux actions → API calls via `FetchApi.fetch()`
2. **API Requests** → Backend Express routes → Controllers → Models → MongoDB
3. **API Responses** → JSON → Frontend Redux reducers → UI updates

### Dependency Boundaries
- **Clear Separation**: Frontend and Backend are completely independent repositories
- **No Shared Code**: Each repository has its own `package.json`, dependencies, and build system
- **API Contract**: Communication happens only through HTTP REST API
- **No Monorepo**: Repositories are opened together only for analysis purposes

### Backend Architecture
```
server.js
  └── app.js (Express initialization)
      └── routes/main.routes.js
          └── Individual route files (auth, profile, explore, etc.)
              └── Controllers
                  └── Models (Mongoose)
                      └── MongoDB
```

### Frontend Architecture
```
App.jsx
  └── AppRoutes.jsx
      └── Pages/Components
          └── Redux Slices (state management)
              └── API calls via client.js
                  └── Backend API
```

---

## 4. Authentication & Authorization

### Login Flow
1. User submits credentials via `/api/auth/login` (POST)
2. Backend validates email/password
3. Backend generates JWT token (7-day expiration) with payload: `{ userId, role }`
4. Backend returns token, userId, and role
5. Frontend stores token in Redux state (persisted to localStorage via redux-persist)
6. Frontend includes token in subsequent requests: `Authorization: Bearer <token>`

### Token Handling
- **Token Storage**: Redux state (persisted to localStorage under key `persist:user`)
- **Token Format**: JWT signed with `JWT_ACCESS_TOKEN` secret
- **Token Expiration**: 7 days for access tokens
- **Token Verification**: Backend middleware `isAuthenticated` verifies token on protected routes
- **Token Location**: Can be sent via:
  - `Authorization` header: `Bearer <token>`
  - Query parameter: `?token=<token>`

### Session Expiration Handling
- **401 Response**: Frontend automatically clears localStorage and redirects to `/login?sessionExpired=true`
- **403 Response**: Frontend shows alert and redirects to home page

### Role-Based Access Control
- **User Roles**: Stored as array in User model (e.g., `['user']`, `['creator']`, `['admin']`)
- **Role Checking**: `checkRole()` utility function checks if user's roles include any allowed role
- **Middleware**: `isRouteAllowed(rolesAllowed)` middleware enforces role-based access
- **Role Assignment**: 
  - Regular users: `['user']` by default
  - Creators: `['creator']` with `status: 'pending'` (requires admin approval)
  - Admins: `['admin']` (assumption - not explicitly seen in signup flow)

### Protected Routes
**Backend**:
- Routes with `isAuthenticated` middleware require valid JWT token
- Routes with `isRouteAllowed(['admin'])` require specific roles

**Frontend**:
- `ProtectedRoute` component checks authentication state
- `PaidUserRoute` component checks both authentication and payment status
- Unauthenticated users redirected to `/login`

### Email Verification
- New users receive verification email with JWT token link
- Token expires after verification (7-day token for signup, 20-minute token for password reset)
- Verification endpoint: `/api/auth/verify-email` (POST)

---

## 5. API Communication

### Common Request Patterns

**Base URL**: Configured via `VITE_REACT_APP_API` environment variable in frontend

**Request Headers**:
```javascript
{
  "Content-Type": "application/json",
  "Accept": "application/json",
  "Authorization": "Bearer <token>",  // For authenticated requests
  "credentials": "include"  // Always included by FetchApi
}
```

**Request Body**: JSON stringified automatically by `FetchApi.fetch()`

### Error Response Format

**Standard Error Structure**:
```json
{
  "success": false,
  "message": "Error message here",
  "field": "fieldName",  // Optional - indicates which field caused error
  "code": "ERROR_CODE",  // Optional - specific error code
  "error": "Detailed error message"  // Optional - for 500 errors
}
```

**HTTP Status Codes**:
- `200`: Success
- `201`: Created (e.g., user registration)
- `400`: Bad Request (validation errors, missing fields)
- `401`: Unauthorized (missing/invalid token, session expired)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found (resource doesn't exist)
- `406`: Not Acceptable (e.g., invalid coupon code)
- `500`: Internal Server Error

**Success Response Format**:
```json
{
  "success": true,
  "message": "Success message",
  "data": { ... }  // Response data
}
```

### Pagination Conventions

**Query Parameters**:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 12 for videos, varies by endpoint)

**Pagination Response Format**:
```json
{
  "videos": [...],  // or "data": [...]
  "totalVideos": 100,  // or "total": 100
  "currentPage": 1,
  "totalPages": 9
}
```

**Examples**:
- `/api/explore?page=1&limit=12&search=keyword&category=Education`
- `/api/explore/trending?page=1` (limited to 2 pages, 12 items each)

### Filtering Conventions

**Common Query Parameters**:
- `search`: Text search query
- `category`: Filter by category
- `tags`: Comma-separated tags (e.g., `tags=tag1,tag2`)
- `sortBy`: Sort order (e.g., `views` for trending, `search` for newest)

**Example**:
```
GET /api/explore?page=1&limit=12&search=career&category=Education&tags=guidance,planning&sortBy=views
```

### API Endpoints Structure

**Base Path**: `/api`

**Main Route Groups**:
- `/api/auth` - Authentication (no auth required)
- `/api/profile` - User profiles (authenticated)
- `/api/creator` - Creator content (mixed - some public, some authenticated)
- `/api/explore` - Video exploration (public)
- `/api/survey` - Survey assessments (authenticated)
- `/api/disc` - DISC assessments (authenticated)
- `/api/interest` - Interest profiler (authenticated)
- `/api/onet` - O*NET career data (authenticated)
- `/api/resume` - Resume builder (authenticated)
- `/api/payment` - Payment processing (public endpoints)
- `/api/admin` - Admin operations (authenticated + admin role)
- `/api/unifiedrecord` - Unified user records (authenticated)
- `/api/playlist` - User playlists (authenticated)
- `/api/history` - User viewing history (public)
- `/api/like` - Video likes (authenticated)
- `/api/rating` - Video ratings (authenticated)
- `/api/followers` - User following system (public)
- `/api/viewsAndShares` - Video analytics (public)
- `/api/careerPlanning` - Career planning data (authenticated)
- `/api/transcription` - Video transcription (public)
- `/api/assessment` - Assessment results (public)

---

## 6. Cross-Cutting Rules

### Validation

**Backend Validation**:
- Email validation: `isValidEmail()` utility function
- Password strength: `checkPassStrength()` - requires uppercase, number, minimum 6 characters
- Mongoose schema validation for required fields
- Enum validation for fields like `gender`, `status`, `category`

**Frontend Validation**:
- Form validation handled in components
- Error messages displayed from API responses
- Field-specific errors via `field` property in error response

### Error Handling

**Backend**:
- Try-catch blocks in all controllers
- Standardized error response format
- Field-specific error messages for validation
- 500 errors include error message in development

**Frontend**:
- `FetchApi.fetch()` wrapper handles HTTP errors
- 401 errors: Auto-logout and redirect to login
- 403 errors: Alert and redirect to home
- Other errors: Display error message to user
- Redux Toolkit `rejectWithValue` for async thunk errors

### Logging

**Backend**:
- Console.log for errors and important events
- Chalk library for colored console output
- Error logging in catch blocks: `console.error(error)`
- No structured logging system observed

**Frontend**:
- Console.error for API errors
- React Hot Toast for user notifications
- No structured logging system observed

### File Uploads

**Backend**:
- Multer with S3 storage (`multer-s3`)
- File size limit: 50MB (configured in express.json and express.urlencoded)
- S3 directories:
  - Photos: `AWS_DIRECTORY_PHOTOS`
  - Videos: `AWS_DIRECTORY_VIDEOS`
  - Thumbnails: `AWS_DIRECTORY_THUMBNAILS`

### Email Sending

**Backend**:
- NodeMailer for email delivery
- Email templates in `utility/emailTemplates.js`:
  - Student signup verification
  - Counsellor signup verification
  - Counsellor approval notification (to admin)
  - Password reset
- SMTP configuration via environment variables

### External Service Integrations

**O*NET API**:
- Base URL: `ONET_BASE_URL` environment variable
- Authentication: Basic Auth with `ONET_TOKEN`
- Used for: Career information, interest profiler data, career reports

**Zyla Labs API**:
- Base URL: `ZYLA_BASE_URL` environment variable
- Authentication: Bearer token (`ZYLA_TOKEN`)
- Used for: University rankings, university search by country/name

**Stripe**:
- Payment processing for Career Direction Report ($49.00)
- Coupon code support
- Webhook support (configured but implementation not fully visible)

**AWS S3**:
- File storage for user uploads
- Configuration via AWS credentials in environment variables

**Transcription Service**:
- Python-based transcription service
- Location: `services/transcribe/`

**ML/Recommendation Services**:
- Python scripts in `services/ceml/`
- Used for: Career recommendations, DISC scoring, personality analysis

---

## 7. Known Gaps / Risks / Assumptions

### Assumptions
1. **Admin Role**: Admin role exists and can approve creators, but exact admin creation flow is not visible
2. **Redis Usage**: Redis is configured but connection code is commented out - actual usage unclear
3. **Payment Webhook**: Stripe webhook endpoint exists in commented code but active implementation not visible
4. **Environment Variables**: Full list of required environment variables not documented - inferred from code
5. **Creator Approval**: Creators sign up with `status: 'pending'` and admin receives email, but approval workflow endpoint not clearly visible
6. **Unique ID Generation**: Non-creator users get sequential IDs (YYYYMM####), creators get UUIDs - reason not explicitly documented
7. **Assessment Attempts**: Free users get 3 attempts, paid users get additional attempts - exact logic for attempt tracking not fully visible

### Unknowns
1. **Deployment**: Deployment process and infrastructure setup not documented
2. **Database Migrations**: No migration system visible - schema changes handled manually
3. **API Versioning**: No API versioning strategy visible
4. **Rate Limiting**: No rate limiting middleware observed
5. **Caching Strategy**: Redis configured but not used - caching strategy unclear
6. **Monitoring/Alerting**: No monitoring or alerting system visible
7. **Backup Strategy**: Database backup strategy not documented
8. **Error Tracking**: No error tracking service (e.g., Sentry) integrated
9. **Testing**: No test files visible in either repository
10. **Documentation**: API documentation (Swagger/OpenAPI) not present

### Risks
1. **Token Security**: JWT tokens stored in localStorage (XSS vulnerability risk)
2. **CORS Configuration**: CORS allows all origins (`origin: true`) - may need restriction in production
3. **Error Messages**: Some error responses may leak internal details in development
4. **Password Reset**: 20-minute token expiration for password reset - may be too short for some users
5. **File Upload Limits**: 50MB limit may be insufficient for video uploads
6. **No Input Sanitization**: No visible input sanitization for XSS prevention (beyond Mongoose validation)
7. **Creator Status**: Creators in 'pending' status may not be able to upload content - workflow unclear

### Gaps
1. **Refresh Tokens**: Only access tokens implemented - no refresh token mechanism
2. **Password Policies**: Password strength check exists but no password history or complexity requirements
3. **Account Lockout**: No account lockout mechanism for failed login attempts
4. **Email Verification Enforcement**: Email verification status checked but enforcement on protected routes unclear
5. **Audit Logging**: No audit trail for admin actions or sensitive operations
6. **Data Export**: No user data export functionality visible
7. **Content Moderation**: No visible content moderation system for creator videos
8. **Analytics**: Video view tracking exists but comprehensive analytics not visible

---

## 8. Data Models Overview

### Core Models (Backend)

**User Model**:
- Basic info: firstName, lastName, email, password, mobile, gender, dateOfBirth
- Profile: introBio, profilePicture, country, nationality
- Roles: Array of roles (user, creator, admin)
- Status: active, inactive, deleted, blocked, suspended, pending
- Social: linkedIn, facebook, instagram, telegram, otherUrl
- Education: school, schoolWebsite
- Interests: Map of interest tags to weights
- Unique ID: Sequential for users, UUID for creators

**Video Model**:
- Creator reference
- Content: title, description, videoLink, thumbnail
- Metadata: tags (array), category (enum), language
- YouTube: youtubeLink (boolean), youtubeVideoId
- Analytics: totalViews, totalLikes, totalRatings, averageRating, totalShares

**UnifiedRecord Model**:
- User reference and userDetails reference
- Payment: isPaid, remainingAttempts, lastPaymentDate
- Assessments: Arrays for interestProfile, discProfile, survey (with timestamps)
- Resume: isCompleted, resumeId
- CDR Links: Array of generated report links with attempt numbers

**Payment Model**:
- User reference
- Transaction details: transactionID (Stripe session ID), paymentStatus, amount, currency
- Verification: isVerified flag
- Assessment name

**Other Models**:
- UserDetails, Resume, InterestProfile, DiscProfile, Survey, Playlist, UserHistory, Tags, CareerCluster, CareerPlanning, ReportData, SchoolContactForm, Followers, Like, Rating, ViewsAndShares

---

## 9. Frontend State Management

### Redux Store Structure

**Slices**:
- `auth`: Authentication state (token, userId, isAuthenticated)
- `user`: User profile data
- `profile`: Profile management
- `explore`: Video exploration data
- `survey`: Survey assessment data
- `disc`: DISC assessment data
- `interest`: Interest profiler data
- `onet`: O*NET career data
- `zyla`: Zyla university data
- `unifiedRecord`: Unified user record
- `resume`: Resume builder data
- `payment`: Payment status and attempts
- `playlist`: User playlists
- `history`: Viewing history
- `like`: Video likes
- `rating`: Video ratings
- `creator`: Creator profile data
- `careerPlanning`: Career planning data
- `admin`: Admin operations
- `alert`: Alert messages

**Persistence**:
- Only `auth` slice persisted to localStorage
- Other slices are in-memory only

---

## 10. Build and Development

### Backend
- **Node Version**: 20.*
- **Package Manager**: npm (>=10)
- **Scripts**:
  - `npm run server`: Start with nodemon
  - `npm run lint`: ESLint check
  - `npm run lint-fix`: Auto-fix linting errors
  - `npm run format`: Prettier formatting
  - PM2 scripts for production deployment

### Frontend
- **Build Tool**: Vite
- **Package Manager**: npm
- **Scripts**:
  - `npm run dev`: Development server with host access
  - `npm run build`: Production build
  - `npm run preview`: Preview production build
  - `npm run lint`: ESLint check
  - `npm run format`: Prettier formatting

### Environment Configuration
- **Backend**: `.env` file with variables loaded via `dotenv/config`
- **Frontend**: `.env` file with `VITE_` prefix variables (loaded by Vite)

---

## Document Metadata

**Generated**: Based on codebase analysis
**Repositories Analyzed**:
- `FRONTEND/careerExp-frontend-amplify/`
- `BACKEND/career-explorer-backend/`

**Analysis Date**: Current codebase state
**Note**: This document describes the system AS IT EXISTS. Assumptions and unknowns are explicitly marked.
