# Server

## Installation

To install dependencies:

```bash
bun install
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/your-database-name

# JWT Configuration
JWT_SECRET=your-secret-key-here

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Cookie Configuration (optional)
COOKIE_DOMAIN=localhost

# Default Admin User (optional)
DEFAULT_ADMIN_EMAIL=admin@admin.com
DEFAULT_ADMIN_PASSWORD=admin123
DEFAULT_ADMIN_NAME=Super Admin

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### Getting Cloudinary Credentials

1. Sign up for a free account at [https://cloudinary.com](https://cloudinary.com)
2. Go to your Dashboard
3. Copy your:
   - Cloud Name
   - API Key
   - API Secret

Add these to your `.env` file.

## Running the Server

```bash
bun run dev
```

This project was created using `bun init` in bun v1.2.18. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

## File Uploads

All file uploads are now handled by Cloudinary. Files are automatically uploaded to Cloudinary and URLs are stored in the database instead of local file paths.
