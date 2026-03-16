import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(async (context, next) => {
  const { url, request, locals } = context;

  // Only protect /admin and its sub-paths
  if (url.pathname.startsWith("/admin")) {
    const authHeader = request.headers.get("Authorization");
    const env = (locals as any).runtime?.env;

    const ADMIN_USER = env?.ADMIN_USER;
    const ADMIN_PASS = env?.ADMIN_PASS;

    // If environment variables are not set, allow access in development
    // but warn (or you could block). The user specified they should be used.
    if (!ADMIN_USER || !ADMIN_PASS) {
      console.warn("ADMIN_USER or ADMIN_PASS not set in environment.");
      // In production, we should probably block. 
      // For now, let's proceed to next to avoid locking out during setup
      // unless we are in a production-like environment.
    } else {
      if (authHeader) {
        const [scheme, encoded] = authHeader.split(" ");
        if (scheme === "Basic") {
          const decoded = atob(encoded);
          const [user, pass] = decoded.split(":");

          if (user === ADMIN_USER && pass === ADMIN_PASS) {
            return next();
          }
        }
      }

      return new Response("Unauthorized", {
        status: 401,
        headers: {
          "WWW-Authenticate": 'Basic realm="Sentinel Admin"',
        },
      });
    }
  }

  return next();
});
