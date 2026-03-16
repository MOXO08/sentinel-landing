export const prerender = false;

export async function GET(context: any) {
  const env = context.locals.runtime?.env;
  let reports: any[] = [];

  try {
    if (env?.DB) {
      const result = await env.DB.prepare(`
        SELECT slug, scan_timestamp 
        FROM discovery_audits 
        WHERE is_public = 1 
        AND audit_score > 0 
        AND LENGTH(summary_text) > 20
      `).all();
      reports = result.results || [];
    }
  } catch (e) {
    console.error("Sitemap Fetch Error:", e);
  }

  const categories = ['openai', 'langchain', 'rag', 'agents', 'transformers', 'vector-db', 'ml-pipeline'];
  const insightViews = ['highest-score', 'highest-risk', 'recently-scanned'];

  const categoryEntries = categories.map(cat => `
  <url>
    <loc>https://gettingsentinel.com/ai-compliance/${cat}</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`).join('');

  const insightEntries = insightViews.map(view => `
  <url>
    <loc>https://gettingsentinel.com/ai-compliance/${view}</loc>
    <changefreq>hourly</changefreq>
    <priority>0.7</priority>
  </url>`).join('');

  const reportEntries = reports.map((report: any) => `
  <url>
    <loc>https://gettingsentinel.com/ai-compliance/${report.slug}</loc>
    <lastmod>${new Date(report.scan_timestamp).toISOString().split('T')[0]}</lastmod>
  </url>`).join('');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://gettingsentinel.com/</loc></url>
  <url><loc>https://gettingsentinel.com/docs</loc></url>
  <url><loc>https://gettingsentinel.com/ai-compliance</loc></url>
  <url><loc>https://gettingsentinel.com/ai-compliance-tools</loc></url>
  <url><loc>https://gettingsentinel.com/ai-compliance-faq</loc></url>
  <url><loc>https://gettingsentinel.com/pricing</loc></url>
  <url><loc>https://gettingsentinel.com/sentinel-vs-governance-tools</loc></url>
  ${categoryEntries}
  ${insightEntries}
  ${reportEntries}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml'
    }
  });
}
