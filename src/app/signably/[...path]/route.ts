import { NextRequest, NextResponse } from 'next/server';

const ALLOWED_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'] as const;
type Method = (typeof ALLOWED_METHODS)[number];

function join(base: string, path: string) {
  return `${base.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;
}

async function handler(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params;               // ⬅️ Next 16: params is a Promise
  const base = process.env.SERVER_API_BASE_URL || 'http://signably-api:8000';
  const downstreamPath = (path ?? []).join('/');
  const targetUrl = join(base, join('/api', `/${downstreamPath}`));

  const method = (req.method || 'GET').toUpperCase() as Method;
  if (!ALLOWED_METHODS.includes(method)) {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  }

  // Forward headers (override Host to upstream)
  const headers = new Headers(req.headers);
  headers.set('host', new URL(base).host);

  const hasBody = !['GET', 'HEAD'].includes(method);
  const body = hasBody ? await req.arrayBuffer() : undefined;

  const upstream = await fetch(targetUrl, {
    method,
    headers,
    body: hasBody ? body : undefined,
    cache: 'no-store',
  });

  const proxyHeaders = new Headers(upstream.headers);
  return new NextResponse(upstream.body, {
    status: upstream.status,
    headers: proxyHeaders,
  });
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
export const OPTIONS = handler;
