export const prerender = false;

export async function GET(context: any) {
  const env = context.locals.runtime?.env;
  let slugs: string[] = [];

  try {
    if (env?.DB) {
      const result = await env.DB.prepare(`
        SELECT slug FROM discovery_audits WHERE is_public = 1
      `).all();
      slugs = result.results?.map((r: any) => r.slug) || [];
    }
  } catch (e) {
    console.error("Sitemap Fetch Error:", e);
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://gettingsentinel.com/</loc></url>
  <url><loc>https://gettingsentinel.com/docs</loc></url>
  <url><loc>https://gettingsentinel.com/ai-compliance</loc></url>
  <url><loc>https://gettingsentinel.com/ai-compliance-tools</loc></url>
  <url><loc>https://gettingsentinel.com/ai-compliance-faq</loc></url>
  <url><loc>https://gettingsentinel.com/pricing</loc></url>
  <url><loc>https://gettingsentinel.com/sentinel-vs-governance-tools</loc></url>
  ${slugs.map((slug: string) => `
  <url>
    <loc>https://gettingsentinel.com/ai-compliance/${slug}</loc>
  </url>`).join('')}
</urlset>`.trim();

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml'
    }
  });
}
