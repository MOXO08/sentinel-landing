import type { APIRoute } from 'astro';

export const prerender = false;

async function requireAdminSession(request: Request, env: any) {
    const cookie = request.headers.get('Cookie') || '';
    const match = cookie.match(/sentinel_session=([^;]+)/);
    if (!match) return null;

    const sessionData = await env.CACHE.get(`session:${match[1]}`);
    if (!sessionData) return null;
    
    const session = JSON.parse(sessionData);
    if (session.email !== 'office@gettingsentinel.com') return null; // Authority check

    return session;
}

export const GET: APIRoute = async ({ request, locals, params }) => {
    const env = (locals as any).runtime.env;
    const path = params.admin_path;
    
    const admin = await requireAdminSession(request, env);
    if (!admin) return new Response(JSON.stringify({ error: 'Sentinel Command: ACCESS DENIED' }), { status: 403 });

    if (!env.DB) {
         return new Response(JSON.stringify({ error: 'DB Binding Missing' }), { status: 500 });
    }

    if (path === 'metrics') {
        // Global traffic in last 30 days
        const trafficResult = await env.DB.prepare(
            `SELECT DATE(created_at) as date, COUNT(*) as requests, 
             SUM(CASE WHEN status LIKE '%COMPLIANT%' THEN 1 ELSE 0 END) as compliant,
             SUM(CASE WHEN status = 'NON_COMPLIANT' THEN 1 ELSE 0 END) as non_compliant
             FROM audit_logs 
             WHERE created_at >= date('now', '-30 days')
             GROUP BY DATE(created_at) 
             ORDER BY date ASC`
        ).all();

        const totalAuditLogs = await env.DB.prepare('SELECT COUNT(*) as total FROM audit_logs').first();
        const latestThreats = await env.DB.prepare('SELECT id, incident_type, ip_address, endpoint, colo_node, severity, created_at FROM threat_intel ORDER BY created_at DESC LIMIT 20').all();
        const totalThreats = await env.DB.prepare('SELECT COUNT(*) as total FROM threat_intel').first();

        const latestDiscovery = await env.DB.prepare('SELECT * FROM discovery_audits ORDER BY scan_timestamp DESC LIMIT 50').all();
        const totalDiscovery = await env.DB.prepare('SELECT COUNT(*) as total FROM discovery_audits').first();

        return new Response(JSON.stringify({ 
            traffic: trafficResult.results || [],
            totals: {
                audits: totalAuditLogs.total,
                threats: totalThreats.total,
                discovery: totalDiscovery.total
            },
            threats: latestThreats.results || [],
            discovery: latestDiscovery.results || []
        }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    if (path === 'clients') {
        const result = await env.DB.prepare(
            `SELECT id, email, plan, status, created_at, rpm_limit, 
            (SELECT COUNT(*) FROM audit_logs WHERE client_id = clients.id) as audit_count
             FROM clients 
             ORDER BY created_at DESC`
        ).all();

        return new Response(JSON.stringify({ clients: result.results || [] }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    return new Response('Admin API Not Found', { status: 404 });
};

export const POST: APIRoute = async ({ request, locals, params }) => {
    const env = (locals as any).runtime.env;
    const path = params.admin_path;
    
    const admin = await requireAdminSession(request, env);
    if (!admin) return new Response(JSON.stringify({ error: 'Sentinel Command: ACCESS DENIED' }), { status: 403 });

    if (path === 'action') {
        const body = await request.json() as any;
        const { action, payload } = body;

        if (action === 'suspend_client') {
            await env.DB.prepare('UPDATE clients SET status = "suspended" WHERE id = ?').bind(payload.client_id).run();
            // Also purge their API keys from cache if we had a mapping (Requires full KV scan, skipping for MVP)
            return new Response(JSON.stringify({ success: true }));
        }

        if (action === 'activate_client') {
            await env.DB.prepare('UPDATE clients SET status = "active" WHERE id = ?').bind(payload.client_id).run();
            return new Response(JSON.stringify({ success: true }));
        }

        if (action === 'revoke_key') {
            await env.DB.prepare('UPDATE clients SET api_key_hash = NULL WHERE id = ?').bind(payload.client_id).run();
            return new Response(JSON.stringify({ success: true }));
        }
        
        if (action === 'global_ban_ip') {
             await env.CACHE.put(`ban:${payload.ip}`, "1", { expirationTtl: 86400 * 30 }); // 30 day manual ban
             return new Response(JSON.stringify({ success: true }));
        }
    }

    return new Response('Action Not Found', { status: 404 });
};
