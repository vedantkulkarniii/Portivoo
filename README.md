# Portivo — Portfolio Builder

![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)
![License](https://img.shields.io/badge/License-ISC-blue)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen)

> A modern, fast, and scalable portfolio builder — a production-ready alternative to showcaseMe.in.
> Build, customise, and deploy your personal portfolio in minutes.

## Tech Stack

- **Frontend**: React.js 18+ with Vite, Tailwind CSS v3+, React Router v6, Axios, lucide-react icons
- **Backend**: Node.js with Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT + bcrypt
- **Optimizations**: Compression, rate limiting, efficient queries, lightweight bundles

## Features

- 🔐 User authentication (Register/Login with JWT)
- 📝 Profile management (Identity, Skills, Projects, Experience, Education, Certifications)
- 🎨 Template selection and deployment
- 📊 Profile strength calculation
- 🚀 Subdomain generation for deployed portfolios
- 📱 Responsive design with mobile hamburger menu
- 🎯 Dark theme matching showcaseMe.in design

## Project Structure

```
portivo/
├── backend/          # Express.js API server
├── frontend/         # React.js frontend application
├── .gitignore
├── README.md
└── package.json
```

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory:
   ```env
   MONGO_URI=mongodb://localhost:27017/portivo
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   PORT=5000
   FRONTEND_URL=http://localhost:5173
   NODE_ENV=development
   ```

4. Seed the database with templates (optional):
   ```bash
   node seedTemplates.js
   ```

5. Start the backend server:
   ```bash
   npm start
   # or for development with auto-reload:
   npm run dev
   ```

   The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

   The frontend will run on `http://localhost:5173`

### Running Both Servers

You can run both servers concurrently using the root package.json script:

```bash
# From root directory
npm run dev
```

Or manually in separate terminals:
- Terminal 1: `cd backend && npm start`
- Terminal 2: `cd frontend && npm run dev`

## Database Seeding

To seed the database with default templates, run:

```bash
cd backend
node seedTemplates.js
```

This will create three templates:
- Visualayer
- Draftspace
- Pixelroom

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user (protected)

### Profiles
- `GET /api/profiles/me` - Get user profile (protected)
- `PUT /api/profiles/me` - Update user profile (protected)
- `POST /api/profiles/deploy` - Deploy profile with template (protected)

### Templates
- `GET /api/templates` - Get all templates
- `GET /api/templates/:id` - Get single template

## Environment Variables

### Backend (.env)
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `PORT` - Server port (default: 5000)
- `FRONTEND_URL` - Frontend URL for CORS
- `NODE_ENV` - Environment (development/production)

## Production Build

### Frontend
```bash
cd frontend
npm run build
```

The build output will be in the `frontend/dist` directory.

### Backend
The backend is ready for production. Make sure to:
- Set `NODE_ENV=production`
- Use a secure `JWT_SECRET`
- Configure proper CORS settings
- Use a production MongoDB instance

## Design & Colors

- **Background**: #0A0A0A (zinc-950)
- **Cards**: #18181B (zinc-900)
- **Text**: white / #9CA3AF (gray-400)
- **Purple**: #7C3AED (main), hover #8B5CF6, active #6D28D9
- **Green**: #10B981 (emerald-500)
- **Progress bar**: #7C3AED on #27272A background
- **Font**: Inter or system sans-serif

## Security Features

- JWT authentication with httpOnly cookies
- Password hashing with bcrypt
- Rate limiting (100 requests per 15 minutes)
- Helmet.js for security headers
- Input validation
- CORS configuration
- MongoDB indexes for performance

## Performance Optimizations

- Frontend: Vite fast build, Tailwind purge, code splitting
- Backend: Compression, efficient MongoDB queries, indexes
- Lightweight bundles for small server deployment

## License

ISC

## Author

Portivo Team

## Contributing

We welcome contributions! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines on how to open issues, submit pull requests, and run the project locally.

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for a full list of changes across releases.
