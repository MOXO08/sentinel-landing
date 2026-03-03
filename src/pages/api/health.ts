import type { APIRoute } from 'astro';

export const prerender = false;
export const GET = async () => {
    return new Response('Sentinel Audit API is operational (v3 — Unified SSR)', {
        status: 200,
        headers: { 'Content-Type': 'text/plain' }
    });
};
