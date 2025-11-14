import "dotenv/config";

export const env = {
  port: Number(process.env.PORT) || 3000,
  mongodbUri: process.env.MONGODB_URI || "mongodb://localhost:27017/new-auto-car",
  nodeEnv: process.env.NODE_ENV || "development",
  jwtSecret: process.env.JWT_SECRET || "",
  googleClientId: process.env.GOOGLE_CLIENT_ID || "",
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
  googleCallbackUrl: process.env.GOOGLE_CALLBACK_URL || "http://localhost:3000/api/auth/google/callback",
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:3000",
  cookieDomain: process.env.COOKIE_DOMAIN || undefined,
  defaultAdminEmail: process.env.DEFAULT_ADMIN_EMAIL || "admin@admin.com",
  defaultAdminPassword: process.env.DEFAULT_ADMIN_PASSWORD || "admin123",
  defaultAdminName: process.env.DEFAULT_ADMIN_NAME || "Super Admin",
  useHttps: process.env.USE_HTTPS === "true",
  cookieHttpOnly: process.env.COOKIE_HTTP_ONLY === "true",
};


