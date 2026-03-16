import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request, locals }) => {
    const env = (locals as any).runtime.env;
    const apiKey = request.headers.get("x-sentinel-api-key");
    if (!apiKey) return new Response(JSON.stringify({ error: "missing api key" }), { status: 401 });

    try {
        const body: any = await request.json();
        
        const repo_url = body.repo_url;
        const repo_name = body.repo_name;
        if (!repo_url || !repo_name) return new Response(JSON.stringify({ error: "missing repo details" }), { status: 400 });

        await env.DB.prepare(`
            INSERT INTO discovery_audits (
                repo_url, repo_name, slug, stars, language, detected_ai_stack, 
                audit_score, rules_failed, risk_level, confidence_level, 
                summary_text, visible_gaps, is_public, execution_context
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
            repo_url, 
            repo_name, 
            body.slug || null, 
            body.stars || 0, 
            body.language || "unknown", 
            body.detected_ai_stack || "unknown", 
            body.audit_score || 0,
            JSON.stringify(body.rules_failed || []), 
            body.risk_level || "unknown",
            body.confidence_level || "Medium", 
            body.summary_text || null,
            JSON.stringify(body.visible_gaps || []), 
            (body.is_public ? 1 : 0),
            body.execution_context || "discovery"
        ).run();

        return new Response(JSON.stringify({ status: "recorded" }), { status: 200 });
    } catch (e: any) {
        return new Response(JSON.stringify({ error: e.message || "bad request" }), { status: 400 });
    }
};
