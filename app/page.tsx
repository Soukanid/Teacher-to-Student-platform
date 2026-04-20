export default async function Page({ 
  searchParams 
}: { 
  searchParams: Promise<{ role?: string }> 
}) {
  const params = await searchParams;
  const isAdmin = params.role === 'admin';
  const { data: products } = await supabase.from('products').select('*');

  return (
    // 1. Changed this to <main> to match the closing tag
    <main className="p-10"> 
      <h1 className="text-3xl font-bold">Dad's Website</h1>
      <p>Current Role: {isAdmin ? 'Admin' : 'Visitor'}</p>
      
      <div className="mt-5">
        {products?.map((item) => (
          <div key={item.id} className="border p-2 my-2">
            {item.name} - {item.price} MAD
          </div>
        ))}
      </div> 
    </main> // 2. Now this closing tag matches the opening tag!
  );
}
