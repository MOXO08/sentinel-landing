import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request, locals }) => {
    const env = (locals as any).runtime.env;
    const apiKey = request.headers.get("x-sentinel-api-key");
    if (!apiKey) return new Response(JSON.stringify({ error: "missing api key" }), { status: 401 });

    try {
        const body: any = await request.json();
        
        // Handle Run Events
        if (body.type === 'run_start') {
            await env.DB.prepare(`
                INSERT INTO discovery_runs (run_id, status, started_at)
                VALUES (?, 'running', CURRENT_TIMESTAMP)
            `).bind(body.run_id).run();
            return new Response(JSON.stringify({ status: "run_started" }), { status: 200 });
        }

        if (body.type === 'run_update') {
            await env.DB.prepare(`
                UPDATE discovery_runs SET
                    candidates_found = COALESCE(?, candidates_found),
                    processed_count = COALESCE(?, processed_count),
                    recorded_count = COALESCE(?, recorded_count),
                    error_count = COALESCE(?, error_count)
                WHERE run_id = ?
            `).bind(
                body.candidates_found || null,
                body.processed_count || null,
                body.recorded_count || null,
                body.error_count || null,
                body.run_id
            ).run();
            return new Response(JSON.stringify({ status: "run_updated" }), { status: 200 });
        }

        if (body.type === 'run_end') {
            await env.DB.prepare(`
                UPDATE discovery_runs SET
                    status = ?,
                    finished_at = CURRENT_TIMESTAMP,
                    processed_count = ?,
                    recorded_count = ?,
                    error_count = ?
                WHERE run_id = ?
            `).bind(
                body.status || 'completed',
                body.processed_count || 0,
                body.recorded_count || 0,
                body.error_count || 0,
                body.run_id
            ).run();
            return new Response(JSON.stringify({ status: "run_ended" }), { status: 200 });
        }

        const repo_url = body.repo_url;
        const repo_name = body.repo_name;
        if (!repo_url || !repo_name) return new Response(JSON.stringify({ error: "missing repo details" }), { status: 400 });

        // Record Audit Result
        await env.DB.prepare(`
            INSERT INTO discovery_audits (
                repo_url, repo_name, repo_owner, slug, stars, language, 
                detected_ai_stack, audit_score, rules_failed, rules_passed,
                detected_artifacts, risk_level, 
                compliance_status, confidence_level, summary_text, 
                visible_gaps, is_public, execution_context, categories,
                detected_signals, missing_signals, score_breakdown, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
            ON CONFLICT(repo_url) DO UPDATE SET
                repo_name = excluded.repo_name,
                repo_owner = excluded.repo_owner,
                stars = excluded.stars,
                language = excluded.language,
                detected_ai_stack = excluded.detected_ai_stack,
                audit_score = excluded.audit_score,
                rules_failed = excluded.rules_failed,
                rules_passed = excluded.rules_passed,
                detected_artifacts = excluded.detected_artifacts,
                risk_level = excluded.risk_level,
                compliance_status = excluded.compliance_status,
                confidence_level = excluded.confidence_level,
                summary_text = excluded.summary_text,
                visible_gaps = excluded.visible_gaps,
                categories = excluded.categories,
                detected_signals = excluded.detected_signals,
                missing_signals = excluded.missing_signals,
                score_breakdown = excluded.score_breakdown,
                updated_at = CURRENT_TIMESTAMP
        `).bind(
            repo_url, 
            repo_name, 
            body.repo_owner || "unknown",
            body.slug || null, 
            body.stars || 0, 
            body.language || "unknown", 
            body.detected_ai_stack || "unknown", 
            body.audit_score || 0,
            JSON.stringify(body.rules_failed || []), 
            JSON.stringify(body.rules_passed || []),
            JSON.stringify(body.detected_artifacts || []),
            body.risk_level || "unknown",
            body.compliance_status || "unknown",
            body.confidence_level || "Medium", 
            body.summary_text || null,
            JSON.stringify(body.visible_gaps || []), 
            (body.is_public ? 1 : 0),
            body.execution_context || "discovery",
            body.categories || "[]",
            JSON.stringify(body.detected_signals || []),
            JSON.stringify(body.missing_signals || []),
            JSON.stringify(body.score_breakdown || {}),
        ).run();

        return new Response(JSON.stringify({ status: "recorded" }), { status: 200 });
    } catch (e: any) {
        return new Response(JSON.stringify({ error: e.message || "bad request" }), { status: 400 });
    }
};
