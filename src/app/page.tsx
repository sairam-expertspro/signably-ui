export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const base = process.env.SERVER_API_BASE_URL;
  
  // Data containers
  let healthData = { status: 'unreachable' };
  let welcomeData = { message: 'unreachable' };

  try {
    if (!base) throw new Error('SERVER_API_BASE_URL is not set');

    // Fetch 1: Health
    const resHealth = await fetch(`${base}/api/health`, { cache: 'no-store' });
    if (resHealth.ok) {
      healthData = await resHealth.json();
    }

    // Fetch 2: Welcome (User API)
    const resWelcome = await fetch(`${base}/api/user/welcome`, { cache: 'no-store' });
    if (resWelcome.ok) {
      welcomeData = await resWelcome.json();
    }
  } catch (err) {
    console.error('API Fetch Error:', err);
  }

  return (
    <main className="p-8 space-y-6">
      <h1 className="text-3xl font-bold text-blue-600">Signably Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-2">
        {/* Card 1: System Status */}
        <div className="p-6 bg-white border rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-2">System Status</h2>
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm text-gray-500">Endpoint: /api/health</span>
          </div>
          <p className={`mt-2 font-bold ${healthData.status === 'ok' ? 'text-green-600' : 'text-red-600'}`}>
            {healthData.status.toUpperCase()}
          </p>
        </div>

        {/* Card 2: User Welcome */}
        <div className="p-6 bg-white border rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-2">User API</h2>
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm text-gray-500">Endpoint: /api/user/welcome</span>
          </div>
          <p className="mt-2 text-gray-800">
            {welcomeData.message}
          </p>
        </div>
      </div>

      <div className="text-xs text-gray-400 mt-8">
        Connected to: {base || 'Unknown'}
      </div>
    </main>
  );
}
