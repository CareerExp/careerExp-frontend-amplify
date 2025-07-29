# Career Explorer Frontend

## Overview

Career Explorer is a modern, user-friendly web application designed to help  individuals discover and plan their career paths. This frontend application provides an intuitive interface for accessing  career assessment tools, educational content, and professional development resources.

## Features

- 🎨 Modern, Responsive UI
- 📊 Interactive DISC Assessment
- 🎯 Interest Profile Builder
- 📝 Career Planning Dashboard
- 🎥 Educational Video Library
- 📑 Resume Builder
- 💼 Career Resources
- 👥 User Profile Management
- 🔐 Secure Authentication
- 💳 Payment Integration
- 📱 Mobile-Friendly Design

## Tech Stack

- React 18
- Vite
- Redux Toolkit for state management
- React Router v6
- Tailwind CSS
- Material-UI components
- AWS SDK for file uploads
- Stripe for payments
- Chart.js for data visualization

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Modern web browser
- Backend API running (see backend setup)

## Setup Instructions

1. **Clone the repository**

   ```bash
   git clone [repository-url]
   cd ce-phase2-frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Configuration**

   ```bash
   cp .env.example .env
   ```

   Configure the following environment variables:

   - API endpoints
   - AWS credentials
   - Stripe public key
   - Google OAuth credentials

4. **Start Development Server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`

## Code Quality Tools

The project uses ESLint and Prettier for code quality and formatting:

```bash
# Check for linting errors
npm run lint

# Fix linting errors automatically
npm run lint:fix

# Format code with Prettier
npm run format

# Fix ESLint errors in JS/JSX files
npx eslint . --ext .js,.jsx --fix
```

## Building for Production

1. **Create production build**

   ```bash
   npm run build
   ```

2. **Preview production build**
   ```bash
   npm run preview
   ```

## Project Structure

```
src/
├── assets/        # Static assets (images, fonts)
├── components/    # Reusable UI components
├── config/        # Configuration files
├── context/      # React Context providers
├── models/       # Data models and types
├── pages/        # Page components
├── redux/        # Redux store and slices
├── routes/       # Route definitions
├── styles/       # Global styles and themes
└── utility/      # Helper functions and utilities
```

## Key Features Implementation

### Authentication

- JWT-based authentication
- Google OAuth integration
- Persistent session management
- Protected routes

### Career Assessment Tools

- Interactive DISC assessment
- Interest profile builder
- Real-time progress tracking
- Results visualization

### Content Management

- Video player integration
- Playlist management
- Resource library
- Search and filtering

### User Dashboard

- Progress tracking
- Career recommendations
- Saved resources
- Activity history

## Performance Optimization

- Code splitting
- Lazy loading
- Image optimization
- Caching strategies
- Performance monitoring

## Testing

```bash
# Run tests
npm run test

# Run tests with coverage
npm run test:coverage
```

## Development Guidelines

### Code Style

- Follow ESLint configuration
- Use Prettier for formatting
- Follow component naming conventions
- Implement proper TypeScript types

### Component Structure

- Use functional components
- Implement proper prop types
- Follow React hooks best practices
- Maintain single responsibility principle

### State Management

- Use Redux for global state
- Implement context for theme/auth
- Follow immutability principles
- Optimize re-renders

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Deployment

Deployment guide available in [aws-spa-deployment-guide.md](aws-spa-deployment-guide.md)

### Quick Deployment Steps

1. Build the application
2. Configure AWS S3 bucket
3. Set up CloudFront distribution
4. Configure Route 53 (if using custom domain)
5. Deploy using provided scripts

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## Troubleshooting

Common issues and solutions are documented in the [TROUBLESHOOTING.md](TROUBLESHOOTING.md) file.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support:

- Create an issue in the repository
- Email: support@careerexplorer.com
- Documentation: [docs.careerexplorer.com](https://docs.careerexplorer.com)
