/**
 * An array of routes that are accessible to the public
 * These routes do not require authentication.
 * @type {string[]}
 */
export const publicRoutes: string[] = ["/", "/auth/new-verification"];

/**
 * An array of routes that are used for authentication.
 * These routes will redirect logged-in users to /settings.
 * @type {string[]}
 */
export const authRoutes: string[] = [
  "/auth/login",
  "/auth/register",
  "/auth/error",
  "/auth/reset",
  "/auth/new-password",
];

/**
 * An array of routes that are forbidden for everyone.
 * These routes will redirect logged-in users to /.
 * @type {string[]}
 */
export const forbiddenRoutes: string[] = [
  // "/admin",
];

/**
 * The prefix for API authentication routes.
 * Routes that start with this prefix are used for API authentification purpose.
 * @type {string}
 */
export const apiAuthPrefix: string = "/api/auth";

/**
 * The default redirect path after logging-in.
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT: string = "/profile";
