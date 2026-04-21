import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default async function StudentLibrary({
  searchParams
}: {
  searchParams: Promise<{ folder?: string }>
}) {
  const params = await searchParams;
  const currentFolderId = params.folder || null;

  // Fetching logic remains the same...
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

  return (
    <main className="min-h-screen bg-[#fafafa] font-sans text-zinc-900 selection:bg-zinc-900 selection:text-white">
      {/* Texture Background */}
      <div className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

      {/* --- MODERN NAVBAR --- */}
      <nav className="sticky top-0 z-50 w-full border-b border-zinc-200/50 bg-white/80 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/library" className="flex items-center gap-4 group">
            <div className="h-10 w-10 bg-zinc-900 text-white rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform duration-300">
              <span className="font-black text-lg italic">H</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold tracking-tighter text-sm">Hassan Nid Bella</span>
              <span className="text-[9px] uppercase tracking-widest text-zinc-400 font-black">Bibliothèque</span>
            </div>
          </Link>
          
          <div className="hidden md:block">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-300">
              {currentFolderId ? 'Ressources' : 'Menu Principal'}
            </span>
          </div>
        </div>
      </nav>

      <div className="relative z-10 max-w-4xl mx-auto px-6 pt-12 pb-24 space-y-12">
        
        {/* Navigation Breadcrumbs (Now under the navbar) */}
        <div className="flex items-center gap-3 px-2">
          <Link 
            href="/library" 
            className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 hover:text-zinc-900 transition-colors"
          >
            Accueil
          </Link>
          {currentFolderId && (
            <>
              <span className="text-zinc-200 text-xs">/</span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-900">
                Documents
              </span>
            </>
          )}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Folders & Files map logic stays the same... */}
          {subCategories?.map(cat => (
             <Link key={cat.id} href={`?folder=${cat.id}`} className="group p-8 bg-white border border-zinc-200/60 rounded-[2.5rem] hover:border-zinc-900 hover:shadow-xl hover:shadow-zinc-200/40 transition-all duration-500">
               {/* Folder UI content */}
             </Link>
          ))}

          {files?.map(file => (
            <a key={file.id} href={file.url} target="_blank" className="group p-8 bg-white border border-zinc-200/60 rounded-[2.5rem] hover:border-zinc-900 hover:shadow-xl hover:shadow-zinc-200/40 transition-all duration-500">
               {/* File UI content */}
            </a>
          ))}
        </div>

        {/* Empty State... */}
      </div>
    </main>
  );
}
