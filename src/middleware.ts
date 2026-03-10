import { defineMiddleware } from 'astro:middleware';

// Block direct access via the legacy sentinel-official.pages.dev subdomain.
// All legitimate traffic should use gettingsentinel.com.
const BLOCKED_HOST = 'sentinel-official.pages.dev';

export const onRequest = defineMiddleware(async (context, next) => {
  const host = context.request.headers.get('host') || '';

  if (host === BLOCKED_HOST || host.endsWith('.' + BLOCKED_HOST)) {
    return new Response(
      '<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0;url=https://gettingsentinel.com"></head><body>Redirecting...</body></html>',
      {
        status: 301,
        headers: {
          'Location': 'https://gettingsentinel.com',
          'Content-Type': 'text/html',
          'X-Robots-Tag': 'noindex, nofollow',
        },
      }
    );
  }

  return next();
});
