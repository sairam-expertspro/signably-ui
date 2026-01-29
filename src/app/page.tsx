export default async function HomePage() {
  try {
    const base = process.env.SERVER_API_BASE_URL || 'http://signably-api:8000';
    const res = await fetch(`${base}/api/health`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Upstream returned ${res.status}`);
    const data = (await res.json()) as { status?: string };

    return (
      <main className="p-8">
        <h1 className="text-2xl font-semibold">Signably UI</h1>
        <p className="mt-2">API Health: {data?.status ?? 'unknown'}</p>
      </main>
    );
  } catch (err) {
    console.error('Health check failed:', err);
    return (
      <main className="p-8">
        <h1 className="text-2xl font-semibold">Signably UI</h1>
        <p className="mt-2 text-red-600">API Health: error (see logs)</p>
      </main>
    );
  }
}
