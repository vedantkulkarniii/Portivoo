# Portivo Enhancement Integration Guide

## Overview
This guide covers the integration of enhanced portfolio types, image uploads, subdomain management, and public portfolio views.

## Backend Changes

### 1. Install Dependencies
```bash
cd backend
npm install multer
```

### 2. Updated Files
- `backend/models/Profile.js` - Expanded with all fields for 9 portfolio types + Custom
- `backend/controllers/profileController.js` - Added image upload, subdomain check, public view, toggle active
- `backend/routes/profiles.js` - Added new routes for upload, subdomain, public view
- `backend/middleware/upload.js` - NEW: Multer configuration for image uploads
- `backend/app.js` - Added static file serving for uploads
- `backend/package.json` - Added multer dependency

### 3. Create Uploads Directory
```bash
mkdir backend/uploads
```

### 4. Environment Variables
No new environment variables needed. Ensure MongoDB is running.

## Frontend Changes

### 1. Updated Files
- `frontend/src/pages/Settings.jsx` - Added Custom portfolio type (10th option)
- `frontend/src/pages/Profile.jsx` - Added SubdomainDialog, ImageUpload, functional socials
- `frontend/src/pages/Dashboard.jsx` - Updated LiveDeploymentCard with Edit/Deactivate
- `frontend/src/components/LiveDeploymentCard.jsx` - Added Edit subdomain and Deactivate buttons
- `frontend/src/components/ImageUpload.jsx` - NEW: Image upload component
- `frontend/src/components/SubdomainDialog.jsx` - NEW: Subdomain dialog component
- `frontend/src/pages/PortfolioView.jsx` - NEW: Public portfolio view page
- `frontend/src/services/api.js` - Added uploadImage helper function
- `frontend/src/App.jsx` - Added public route `/:subdomain`

## Key Features Implemented

### 1. Expanded Portfolio Types
All 9 portfolio types now have 10-15+ detailed fields:
- **Developer**: Identity, Socials, Skills, Projects, Experience, Education, Certifications, Tech Stack, Open Source, Blog Articles, Awards, References
- **Photographer**: Identity, Socials, Gallery Portfolio, Clients, Equipment, Exhibitions, Awards, Education, Publications, Style/Specialties, Testimonials
- **UI/UX Designer**: Identity, Socials, Case Studies, Tools, Experience, Education, Design Systems, Prototypes, Visual Work, Awards, Client Feedback
- **Graphic Designer**: Identity, Socials, Visual Portfolio, Clients, Tools, Brand Identities, Illustrations, Print/Digital Work, Awards, Specialties
- **Content Writer**: Identity, Socials, Writing Samples, Publications, Topics, SEO Skills, Blog Posts, Ghostwriting Exp, Education, Awards
- **Digital Marketer**: Identity, Socials, Campaigns, Metrics, Tools, Clients, Content Strategy, Social Media Growth, Certifications, Education
- **Architect**: Identity, Socials, Project Gallery, Built Works, Software, Awards, Clients, Sustainability Focus, Education, Professional Licenses
- **Musician/Artist**: Identity, Socials, Audio/Video Portfolio, Releases, Performances, Instruments, Collaborations, Awards, Education
- **Teacher/Educator**: Identity, Socials, Courses Taught, Students Impact, Subjects, Certifications, Institutions, Teaching Materials, Awards, Education
- **Custom**: Dynamic fields that users can add

### 2. Image Uploads
- File input with drag & drop
- Client-side validation (1MB limit, image types only)
- Server-side validation via multer
- Images stored in `backend/uploads/`
- Served at `http://localhost:5000/uploads/filename`

### 3. Subdomain Management
- Dialog appears on first "Save Portfolio" if no subdomain exists
- Subdomain validation (3+ chars, alphanumeric + hyphens)
- Uniqueness check via API
- Edit subdomain from Dashboard
- Format: `username.portivo.in`

### 4. Portfolio Activation/Deactivation
- Toggle active status from Dashboard
- Deactivated portfolios show "Portfolio Not Available" message
- Active status shown in Dashboard (green "Online" / red "Deactivated")

### 5. Functional Socials
- Removed "Locked Coming soon"
- Array of social links with platform dropdown
- Platforms: GitHub, LinkedIn, Twitter, StackOverflow, Instagram, Behance, Dribbble, Medium, SoundCloud, YouTube, Website
- Add/Remove functionality

### 6. Public Portfolio View
- Route: `/:subdomain`
- Fetches portfolio data from `/api/profiles/public/:subdomain`
- Shows "Portfolio Not Available" if deactivated or not found
- Renders portfolio based on type (basic implementation, can be expanded)

### 7. Profile Strength Calculation
- Calculated per portfolio type
- Counts mandatory fields for each type
- Shows percentage and missing sections
- Updates automatically on save

## Testing Checklist

1. **Image Upload**
   - [ ] Upload avatar in Identity section
   - [ ] Upload project images
   - [ ] Verify 1MB limit validation
   - [ ] Verify image type validation

2. **Subdomain**
   - [ ] Save profile without subdomain → dialog appears
   - [ ] Set subdomain → validates uniqueness
   - [ ] Edit subdomain from Dashboard
   - [ ] Visit public portfolio at `/:subdomain`

3. **Portfolio Types**
   - [ ] Switch between all 10 types in Settings
   - [ ] Verify sections change in Profile page
   - [ ] Add Custom type fields dynamically

4. **Socials**
   - [ ] Add multiple social links
   - [ ] Select different platforms
   - [ ] Remove social links

5. **Activation**
   - [ ] Deactivate portfolio from Dashboard
   - [ ] Visit public URL → shows "deactivated" message
   - [ ] Activate again → portfolio visible

6. **Profile Strength**
   - [ ] Fill different sections
   - [ ] Verify percentage updates
   - [ ] Check missing sections pills

## Next Steps (Optional Enhancements)

1. **Expand PortfolioView.jsx**
   - Add full rendering for all portfolio types
   - Beautiful templates for each type
   - Responsive design

2. **Image Optimization**
   - Add image compression before upload
   - Generate thumbnails
   - Use CDN (Cloudinary) for production

3. **Custom Fields UI**
   - Better UI for adding custom sections
   - Field type selector (text, textarea, list, upload)
   - Drag & drop to reorder

4. **Profile Strength Details**
   - Show which specific fields are missing
   - Provide quick-fill suggestions
   - Progress indicators per section

5. **Analytics**
   - Track portfolio views
   - Visitor analytics
   - Popular sections

## Notes

- Image uploads are stored locally in `backend/uploads/`
- For production, consider using cloud storage (AWS S3, Cloudinary)
- Subdomain validation is basic - can be enhanced with reserved words check
- Public portfolio view is basic - expand with full templates
- Profile strength calculation is type-specific and counts filled vs total fields

## Troubleshooting

**Images not loading:**
- Check `backend/uploads/` directory exists
- Verify static file serving in `app.js`
- Check file permissions

**Subdomain not saving:**
- Verify MongoDB connection
- Check subdomain uniqueness
- Ensure validation passes

**Public portfolio not found:**
- Verify portfolio is active
- Check subdomain matches exactly
- Verify route in App.jsx

