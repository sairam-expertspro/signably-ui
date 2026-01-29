export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const base = process.env.SERVER_API_BASE_URL;
  if (!base) {
    // This will cause a server error, which is appropriate if the config is missing.
    throw new Error('SERVER_API_BASE_URL environment variable is not set.');
  }

  try {
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
    // The 'fetch failed' TypeError indicates a network or DNS problem.
    console.error(`API health check failed for URL "${base}/api/health"`);
    console.error('Error details:', err);
    if (err instanceof TypeError && (err as any).cause) {
      console.error('Underlying cause:', (err as any).cause);
    }
    return (
      <main className="p-8">
        <h1 className="text-2xl font-semibold">Signably UI</h1>
        <p className="mt-2 text-red-600">API Health: error (see logs)</p>
      </main>
    );
  }
}
