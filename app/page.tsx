
import { supabase } from '@/lib/supabase';

// 1. Update the type to Promise
export default async function Page({ 
  searchParams 
}: { 
  searchParams: Promise<{ role?: string }> 
}) {
  
  // 2. Await the params before accessing them
  const params = await searchParams;
  const isAdmin = params.role === 'admin';

  // Fetch data from Supabase
  const { data: products } = await supabase.from('products').select('*');

  return (
    <div className="p-10 font-sans">
      <h1 className="text-2xl font-bold mb-4">Welcome to Dad's Shop</h1>
      <p className="mb-8">Viewing as: <strong>{isAdmin ? 'Admin' : 'Normal User'}</strong></p>

      {isAdmin && (
        <div className="bg-gray-100 p-6 rounded-lg mb-10 border-2 border-dashed border-gray-400">
          <h2 className="font-bold mb-2 text-black">Admin: Add New Product</h2>
          <form action={async (formData) => {
            'use server'
            const name = formData.get('name');
            const price = formData.get('price');
            // Insert into Supabase
            await supabase.from('products').insert({ name, price });
          }} className="flex gap-2">
            <input name="name" placeholder="Product Name" className="p-2 border text-black" required />
            <input name="price" placeholder="Price" className="p-2 border text-black" type="number" required />
            <button className="bg-blue-600 text-white px-4 py-2 rounded">Add</button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products?.map((p) => (
          <div key={p.id} className="border p-4 rounded shadow-sm bg-white">
            <h3 className="text-xl font-semibold text-black">{p.name}</h3>
            <p className="text-green-600 font-bold">{p.price} MAD</p>
          </div>
        ))}
      </div>
    </div>
  );
}
