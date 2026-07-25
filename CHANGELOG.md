# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added
- CSS custom properties (design tokens) for consistent theming across the frontend
- `NotFound` (404) page component with a link back to home
- `.editorconfig` for cross-editor code style consistency
- `.nvmrc` to pin the Node.js version to v18 LTS
- `CHANGELOG.md` to track project history
- `utils/formatDate.js` utility for standardised date formatting
- Improved rate limiter configuration with a health-check skip list
- `contact` route placeholder in the backend API

---

## [1.0.0] - 2024-01-01

### Added
- Initial project setup with Express.js backend and React + Vite frontend
- User authentication (register / login) with JWT stored in httpOnly cookies
- Profile management: identity, skills, projects, experience, education, certifications
- Template selection and portfolio deployment with subdomain generation
- Profile strength calculation
- Analytics event tracking
- MongoDB models with Mongoose, including indexes for performance
- Compression, rate limiting, and Helmet.js security middleware
- Request logging middleware
- ESLint and Prettier configuration
- Comprehensive backend documentation (`BACKEND_IMPROVEMENTS.md`, `SETUP.md`, `INTEGRATION_GUIDE.md`)

### Security
- Password hashing with bcryptjs
- Input validation via express-validator
- CORS restricted to the configured frontend URL
