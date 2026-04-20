import { supabase } from '@/lib/supabase';

export default async function PublicPage() {
  const { data: products } = await supabase.from('products').select('*');

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold mb-6">Dad's Shop</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products?.map((product) => (
          <div key={product.id} className="border rounded-lg p-4 shadow-sm bg-white">
            <h2 className="text-xl font-semibold text-gray-800">{product.name}</h2>
            <p className="text-green-600 font-bold mt-2">{product.price} MAD</p>
          </div>
        ))}
      </div>
      {products?.length === 0 && (
        <p className="text-gray-500">No products found. Add some in the dashboard!</p>
      )}
    </main>
  );
}
