import { NextRequest, NextResponse } from 'next/server';

const ALLOWED_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'] as const;
type Method = (typeof ALLOWED_METHODS)[number];

function join(base: string, path: string) {
  return `${base.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;
}

async function proxy(req: NextRequest, { params }: { params: { path: string[] } }) {
  const base = process.env.SERVER_API_BASE_URL || 'http://signably-api:8000';
  const downstreamPath = params.path?.join('/') || '';
  const targetUrl = join(base, join('/api', `/${downstreamPath}`));

  const method = (req.method || 'GET') as Method;
  if (!ALLOWED_METHODS.includes(method)) {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  }

  // Prepare headers: forward most headers, but override host
  const headers = new Headers(req.headers);
  headers.set('host', new URL(base).host);

  // Read body for non-GET/HEAD
  const hasBody = !['GET', 'HEAD'].includes(method);
  const body = hasBody ? await req.arrayBuffer() : undefined;

  const upstream = await fetch(targetUrl, {
    method,
    headers,
    body: hasBody ? body : undefined,
    // Avoid caching; you can tune per route if needed
    cache: 'no-store',
  });

  // Copy response headers/status transparently
  const proxyHeaders = new Headers(upstream.headers);
  return new NextResponse(upstream.body, {
    status: upstream.status,
    headers: proxyHeaders,
  });
}

// Bind all HTTP verbs you want to support
export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
export const OPTIONS = proxy;
