# Eng Techno - Commercial Security Company Website

Full-stack commercial website for a security company with admin dashboard for content management. Built with Next.js and Express.js.

## Features

- Public website with responsive design and SEO-optimized meta tags
- Admin dashboard for managing all website content (hero, about, services, events, announcements, media, clients/partners, mission & vision, core values, footer, users)
- JWT authentication with secure admin routes
- Cloudinary integration for image uploads
- Global search functionality

## Tech Stack

**Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS, shadcn/ui, Zustand, TanStack Query, React Hook Form, Zod, React Awesome Reveal

**Backend:** Express.js 5, TypeScript, MongoDB, Mongoose, JWT, bcryptjs, Cloudinary, Multer, Helmet, CORS

**Tools:** ESLint, Prettier, Bun

## Getting Started

### Prerequisites

- Bun (v1.0.0+)
- MongoDB (local or Atlas)
- Cloudinary account (optional)

### Installation

```bash
git clone <repository-url>
cd eng-techno

# Frontend
cd frontend && bun install

# Backend
cd ../backend && bun install
```

### Environment Variables

**Backend `.env`:**
```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/eng-techno
JWT_SECRET=your-secret-key
FRONTEND_URL=http://localhost:3000
DEFAULT_ADMIN_EMAIL=admin@admin.com
DEFAULT_ADMIN_PASSWORD=admin123
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

**Frontend:** Update `frontend/utils/constants.ts` with backend URL:
```typescript
export const BASE_URL = "http://localhost:3001";
export const API_URL = `${BASE_URL}/api`;
```

### Running

```bash
# Backend
cd backend && bun run dev  # http://localhost:3001

# Frontend
cd frontend && bun run dev  # http://localhost:3000
```

**Default Admin:** `admin@admin.com` / `admin123`

## Scripts

**Frontend:** `bun run dev`, `bun run build`, `bun run start`, `bun run lint`

**Backend:** `bun run dev`, `bun run build`

**Format:** `prettier --write .` (both frontend and backend)

## API Endpoints

All endpoints prefixed with `/api`. Admin routes require authentication.

**Auth:** `POST /api/auth/login`, `GET /api/auth/check-auth`, `GET /api/auth/user-data`, `GET /api/auth/logout`

**Content (GET public, CRUD admin):** `/api/hero`, `/api/about`, `/api/services`, `/api/events`, `/api/announcements`, `/api/media-centre`, `/api/about-page-hero`, `/api/about-page-content`, `/api/client-partners`, `/api/mission-vision`, `/api/core-values`, `/api/compliance-quality`, `/api/footer`

**Other:** `/api/search` (public), `/api/users` (admin only), `/health` (health check)

## SEO & Meta Tags

The application includes comprehensive SEO optimization with proper meta tags handling for all pages, including dynamic Open Graph and Twitter Card tags for better social media sharing and search engine visibility.

## Code Quality

- ESLint 9 with Next.js config (`frontend/eslint.config.mjs`)
- Prettier configured for both frontend and backend (`.prettierrc.json`)

## Deployment

**Frontend (Vercel):**
- Framework: Next.js
- Root: `frontend`
- Build: `bun run build`
- Update `BASE_URL` in `utils/constants.ts`

**Backend (Railway/Render/Fly.io):**
- Root: `backend`
- Build: `bun install`
- Start: `bun run index.ts`
- Set all environment variables

**MongoDB:** Use MongoDB Atlas for production

**Post-Deployment:** Update `BASE_URL`, set secure `JWT_SECRET`, configure CORS, set up MongoDB Atlas, configure Cloudinary, change default admin credentials, enable HTTPS

## Links

- GitHub Repository: git@github.com:Elgedawy31/eng-techno.git
- Live Demo: [Add your live URL here]   

## Author

Mohamed Elgedawy
