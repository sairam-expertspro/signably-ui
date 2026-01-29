import { NextResponse } from 'next/server';

export async function GET() {
  const base = process.env.SERVER_API_BASE_URL || 'http://signably-api:8000';
  const upstream = await fetch(`${base}/api/health`, { cache: 'no-store' });
  const data = await upstream.json();
  return NextResponse.json(data, { status: upstream.status });
}