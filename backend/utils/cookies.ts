import { env } from "../config/env";

export interface CookieOptions {
  httpOnly?: boolean;
  secure: boolean;
  sameSite: "strict" | "lax" | "none";
  domain?: string;
  path: string;
  maxAge?: number;
}

export const getCookieOptions = (): CookieOptions => {
  const isProduction = env.nodeEnv === "production";
  const useHttps = env.useHttps || isProduction;

  return {
    httpOnly: env.cookieHttpOnly, // Configurable via env, default false
    secure: useHttps, // true for HTTPS, false for HTTP
    sameSite: useHttps ? "none" : "lax", // "none" requires secure=true for cross-site
    ...(env.cookieDomain && { domain: env.cookieDomain }),
    path: "/",
  };
};


export const getAccessTokenCookieOptions = (): CookieOptions => {
  return {
    ...getCookieOptions(),
    maxAge: 15 * 60 * 1000, // 15 minutes
  };
};

