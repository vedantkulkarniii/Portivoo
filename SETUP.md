# Portivo Setup Guide

## Overview
Portivo is a full-stack portfolio builder application with a React frontend and Express.js backend. This document provides complete setup instructions.

## Prerequisites

Before you begin, ensure you have installed:
- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **MongoDB** (Local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) - Free tier available)
- **Git** (for version control)

## Project Structure

```
portivo/
├── app.js                 # Express app configuration
├── server.js             # Server entry point
├── package.json          # Dependencies and scripts
├── .env.example          # Environment variables template
│
├── config/
│   └── db.js            # MongoDB connection
│
├── models/              # Database schemas
│   ├── User.js
│   ├── Profile.js
│   ├── Template.js
│   └── AnalyticsEvent.js
│
├── controllers/         # Business logic
│   ├── authController.js
│   ├── profileController.js
│   ├── templateController.js
│   └── analyticsController.js
│
├── routes/             # API endpoints
│   ├── auth.js
│   ├── profiles.js
│   ├── templates.js
│   └── analytics.js
│
├── middleware/         # Custom middleware
│   ├── auth.js
│   ├── errorHandler.js
│   └── upload.js
│
├── src/               # React frontend (Vite)
│   ├── main.jsx
│   ├── App.jsx
│   ├── index.css
│   └── pages/
│       ├── Login.jsx
│       ├── Register.jsx
│       ├── Dashboard.jsx
│       ├── Profile.jsx
│       ├── Settings.jsx
│       └── PortfolioView.jsx
│
├── uploads/          # User uploaded files (local)
└── utils/           # Utility functions
    └── generateSubdomain.js
```

## Installation Steps

### 1. Clone Repository

```bash
git clone https://github.com/vedantkulkarniii/Portivoo.git
cd Portivoo
```

### 2. Install Dependencies

```bash
npm install
```

This will install all backend and frontend dependencies as configured in package.json.

### 3. Environment Configuration

Create a `.env` file in the project root by copying the example:

```bash
cp .env.example .env
```

Edit `.env` and update the values:

```env
# MongoDB Connection
MONGO_URI=mongodb://localhost:27017/portivo
# For MongoDB Atlas cloud:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/portivo

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Configuration
FRONTEND_URL=http://localhost:5173
```

### 4. Database Setup

#### Option A: Local MongoDB

Install MongoDB Community Edition:
- [Windows](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/)
- [macOS](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-macos/)
- [Linux](https://docs.mongodb.com/manual/administration/install-on-linux/)

Start MongoDB:
```bash
# macOS with Homebrew
brew services start mongodb-community

# Windows (if installed as service)
# MongoDB should start automatically

# Manual start
mongod
```

#### Option B: MongoDB Atlas (Cloud)

1. Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get your connection string
4. Update `MONGO_URI` in `.env`

### 5. Seed Database (Optional)

Seed the database with default templates:

```bash
npm run seed
```

This creates three portfolio templates:
- Visualayer
- Draftspace
- Pixelroom

## Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
npm run dev
```
Backend runs on `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
npm run dev:frontend
```
Frontend runs on `http://localhost:5173`

### Production Mode

**Build Frontend:**
```bash
npm run build
```

**Start Server:**
```bash
npm start
```

Server runs on port specified in `.env` (default: 5000)

## Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start backend in development mode with auto-reload
- `npm run dev:frontend` - Start Vite frontend development server
- `npm run build` - Build React frontend for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues automatically
- `npm run format` - Format code with Prettier

## Code Quality

### Linting

```bash
npm run lint
npm run lint:fix
```

### Code Formatting

```bash
npm run format
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Profiles

- `GET /api/profiles/me` - Get user profile (protected)
- `PUT /api/profiles/me` - Update profile (protected)
- `POST /api/profiles/upload` - Upload image (protected)
- `GET /api/profiles/public/:subdomain` - Get public portfolio

### Templates

- `GET /api/templates` - Get all templates
- `GET /api/templates/:id` - Get template details

### Analytics

- `GET /api/analytics` - Get portfolio analytics (protected)
- `POST /api/analytics/event` - Log analytics event

## Troubleshooting

### MongoDB Connection Issues

**Error: `connect ECONNREFUSED`**
- Ensure MongoDB is running
- Check `MONGO_URI` is correct in `.env`
- For Atlas, ensure IP is whitelisted

### Port Already in Use

**Error: `EADDRINUSE: address already in use :::5000`**
```bash
# Find and kill process on port 5000
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:5000 | xargs kill -9
```

### Dependencies Installation Issues

```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### CORS Errors

Ensure `FRONTEND_URL` in `.env` matches your frontend URL (default: `http://localhost:5173`)

## Security Notes

⚠️ **Important for Production:**

1. Change `JWT_SECRET` to a strong random string
2. Set `NODE_ENV=production`
3. Use MongoDB Atlas or managed database service
4. Enable HTTPS
5. Add rate limiting (already configured)
6. Use environment variables for sensitive data
7. Set up proper CORS origins
8. Enable helmet.js security headers (already configured)

## Performance Tips

- Enable gzip compression (already configured)
- Use MongoDB indexes (already set up)
- Optimize images before upload
- Consider CDN for file storage (production)
- Enable caching strategies

## Deployment

### Vercel (Frontend)

```bash
npm run build
# Deploy dist/ folder to Vercel
```

### Railway/Render (Backend)

```bash
# Connect GitHub repo
# Configure environment variables
# Deploy
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## Support & Issues

For issues or questions:
1. Check existing GitHub issues
2. Create a new issue with detailed description
3. Include error messages and steps to reproduce

## License

ISC

---

**Last Updated:** July 2024
