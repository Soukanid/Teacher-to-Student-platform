import { supabase } from '@/lib/supabase';

export default async function TestConnection() {
  // Try to fetch something from your categories table
  const { data, error } = await supabase.from('categories').select('count');

  return (
    <div className="p-10 font-mono">
      <h1 className="text-2xl font-bold mb-4">Supabase Connection Test</h1>
      
      <div className="space-y-4">
        <div>
          <strong>Status:</strong> {error ? '❌ Failed' : '✅ Connected'}
        </div>

        {error ? (
          <div className="bg-red-100 p-4 rounded text-red-700 border border-red-300">
            <p className="font-bold">Error Message:</p>
            <pre>{JSON.stringify(error, null, 2)}</pre>
          </div>
        ) : (
          <div className="bg-green-100 p-4 rounded text-green-700 border border-green-300">
            <p>Successfully reached the database!</p>
            <p>Found <strong>{data?.length || 0}</strong> categories in the table.</p>
          </div>
        )}

        <div className="bg-gray-100 p-4 rounded border text-xs">
          <p className="font-bold">Checking URL:</p>
          <p>{process.env.DAD_SUPABASE_URL || "MISSING"}</p>
        </div>
      </div>
    </div>
  );
}
