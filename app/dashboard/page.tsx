import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export default async function AdminDashboard({ 
  searchParams 
}: { 
  searchParams: Promise<{ folder?: string }> 
}) {
  // --- AUTH CHECK ---
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get('admin_access');

  if (!isAdmin || isAdmin.value !== 'true') {
    redirect('/login');
  }

  const params = await searchParams;
  const currentFolderId = params.folder || null;

  // --- 1. DATA FETCHING ---
  let catQuery = supabase.from('categories').select('*');
  if (!currentFolderId) {
    catQuery = catQuery.is('parent_id', null);
  } else {
    catQuery = catQuery.eq('parent_id', currentFolderId);
  }
  const { data: subCategories } = await catQuery;

  const { data: files } = await supabase
    .from('files')
    .select('*')
    .eq('category_id', currentFolderId);


  // --- 2. SERVER ACTIONS ---
  async function addSubCategory(formData: FormData) {
    'use server'
    const name = formData.get('name');
    const { error } = await supabase.from('categories').insert([
      { name, parent_id: currentFolderId }
    ]);
    if (error) console.error("Erreur:", error);
    revalidatePath('/dashboard');
  }

  async function deleteItem(id: number, type: 'folder' | 'file') {
    'use server'
    const table = type === 'folder' ? 'categories' : 'files';
    await supabase.from(table).delete().eq('id', id);
    revalidatePath('/dashboard');
  }

  async function uploadFile(formData: FormData) {
    'use server'
    try {
      const file = formData.get('file') as File;
      if (!file || !file.name) return;
      const fileName = `${Date.now()}-${file.name}`;
      
      const { data: storageData, error: storageError } = await supabase.storage
        .from('school-files')
        .upload(fileName, file);

      if (storageError) throw new Error(`Storage: ${storageError.message}`);

      const { data: { publicUrl } } = supabase.storage
        .from('school-files')
        .getPublicUrl(fileName);

      const { error: dbError } = await supabase.from('files').insert([{
        name: file.name,
        url: publicUrl,
        category_id: currentFolderId
      }]);

      if (dbError) throw new Error(`Database: ${dbError.message}`);
      revalidatePath('/dashboard');
    } catch (err: any) {
      console.error(err.message);
    }
  }

  // --- 3. UI RENDER (ZINC MINIMALIST THEME) ---
  return (
    <main className="min-h-screen bg-[#fafafa] p-6 md:p-12 font-sans text-zinc-900 selection:bg-zinc-900 selection:text-white">
      {/* Premium Grain Overlay */}
      <div className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

      <div className="relative z-10 max-w-5xl mx-auto space-y-12">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tighter text-zinc-900 flex items-center gap-3">
              <span className="h-8 w-8 bg-zinc-900 text-white rounded-lg flex items-center justify-center text-sm font-black italic">H</span>
              Hassan Nid Bella
            </h1>
            <p className="text-zinc-400 text-sm font-medium">
              {currentFolderId ? 'Ressources pédagogiques' : 'Niveaux scolaires & Administration'}
            </p>
          </div>
          {currentFolderId && (
            <Link href="/dashboard" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-zinc-200 text-zinc-900 text-xs font-bold rounded-full hover:bg-zinc-50 transition-all active:scale-95 shadow-sm">
              ← Retour au menu
            </Link>
          )}
        </header>

        {/* Form Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Nouveau Dossier Card */}
          <section className="bg-white p-8 rounded-[2.5rem] border border-zinc-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
            <h2 className="text-[10px] uppercase tracking-[0.2em] font-black text-zinc-400 mb-6">Nouveau Répertoire</h2>
            <form action={addSubCategory} className="flex flex-col sm:flex-row gap-3">
              <input 
                name="name" 
                placeholder="Ex: Mathématiques" 
                className="flex-1 bg-zinc-50 border border-zinc-100 rounded-2xl px-5 py-3.5 focus:bg-white focus:border-zinc-900 focus:ring-0 outline-none transition-all placeholder:text-zinc-300 text-sm" 
                required 
              />
              <button className="bg-zinc-900 text-white px-6 py-3.5 rounded-2xl font-bold hover:bg-black transition-all cursor-pointer text-sm">
                Ajouter
              </button>
            </form>
          </section>

          {/* Upload File Card */}
          <section className="bg-white p-8 rounded-[2.5rem] border border-zinc-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
            <h2 className="text-[10px] uppercase tracking-[0.2em] font-black text-zinc-400 mb-6">Publier un Document</h2>
            {currentFolderId ? (
              <form action={uploadFile} className="flex flex-col sm:flex-row gap-3">
                <input 
                  type="file" 
                  name="file" 
                  className="flex-1 text-[10px] text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:uppercase file:tracking-widest file:bg-zinc-900 file:text-white hover:file:bg-black file:cursor-pointer bg-zinc-50 border border-zinc-100 rounded-2xl p-2" 
                  required 
                />
                <button className="bg-zinc-900 text-white px-6 py-3.5 rounded-2xl font-bold hover:bg-black transition-all cursor-pointer text-sm">
                  Publier
                </button>
              </form>
            ) : (
              <div className="h-[54px] flex items-center justify-center bg-zinc-50 border border-dashed border-zinc-200 rounded-2xl text-[11px] text-zinc-400 font-medium uppercase tracking-wider">
                Sélectionnez un niveau d'abord
              </div>
            )}
          </section>
        </div>

        {/* Content List Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-sm font-black uppercase tracking-widest text-zinc-400">Contenu disponible</h3>
            <div className="h-[1px] flex-1 mx-6 bg-zinc-100"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Folder Items */}
            {subCategories?.map(cat => (
              <div key={cat.id} className="group relative">
                <Link href={`?folder=${cat.id}`} className="block p-8 bg-white border border-zinc-200/60 rounded-[2.5rem] hover:border-zinc-900 hover:shadow-xl hover:shadow-zinc-200/40 transition-all duration-500">
                  <div className="flex flex-col items-center text-center gap-4">
                    <div className="w-16 h-16 bg-zinc-50 rounded-2xl flex items-center justify-center text-3xl filter grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110">
                      📁
                    </div>
                    <span className="font-bold text-sm tracking-tight text-zinc-800">{cat.name}</span>
                  </div>
                </Link>
                <form action={async () => { 'use server'; await deleteItem(cat.id, 'folder'); }}>
                  <button className="absolute -top-1 -right-1 bg-zinc-900 text-white w-7 h-7 rounded-full text-[10px] opacity-0 group-hover:opacity-100 transition-all shadow-xl flex items-center justify-center cursor-pointer hover:bg-red-500 hover:scale-110 active:scale-90">
                    ×
                  </button>
                </form>
              </div>
            ))}

            {/* File Items */}
            {files?.map(file => (
              <div key={file.id} className="group relative">
                <a href={file.url} target="_blank" className="block p-8 bg-zinc-50/50 border border-transparent rounded-[2.5rem] hover:bg-white hover:border-zinc-900 hover:shadow-xl hover:shadow-zinc-200/40 transition-all duration-500">
                  <div className="flex flex-col items-center text-center gap-4">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-3xl filter grayscale group-hover:grayscale-0 transition-all duration-500">
                      📄
                    </div>
                    <span className="font-medium text-[13px] text-zinc-500 truncate max-w-full">{file.name}</span>
                  </div>
                </a>
                <form action={async () => { 'use server'; await deleteItem(file.id, 'file'); }}>
                  <button className="absolute -top-1 -right-1 bg-zinc-900 text-white w-7 h-7 rounded-full text-[10px] opacity-0 group-hover:opacity-100 transition-all shadow-xl flex items-center justify-center cursor-pointer hover:bg-red-500 hover:scale-110 active:scale-90">
                    ×
                  </button>
                </form>
              </div>
            ))}

            {/* Empty State */}
            {(!subCategories?.length && !files?.length) && (
              <div className="col-span-full py-24 text-center rounded-[3rem] border border-dashed border-zinc-200 bg-zinc-50/30">
                <p className="text-zinc-300 font-black uppercase tracking-[0.4em] text-[9px]">
                  Aucun élément dans ce répertoire
                </p>
              </div>
            )}
          </div>
        </div>

      </div>
    </main>
  );
}
