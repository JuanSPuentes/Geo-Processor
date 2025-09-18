import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
    const body = await req.json();
    const nestUrl = process.env.NEST_URL || 'http://localhost:3001';
    const res = await fetch(`${nestUrl}/geo/process`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
    const data = await res.json();
    return new Response(JSON.stringify(data), { status: res.status, headers: { 'Content-Type': 'application/json' } });
}