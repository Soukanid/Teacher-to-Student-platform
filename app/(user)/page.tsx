// app/library/page.tsx
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default async function StudentLibrary({
  searchParams
}: {
  searchParams: Promise<{ folder?: string }>
}) {
  const params = await searchParams;
  const currentFolderId = params.folder || null;

  // 1. Fetch Folders
  let catQuery = supabase.from('categories').select('*');
  if (!currentFolderId) {
    catQuery = catQuery.is('parent_id', null);
  } else {
    catQuery = catQuery.eq('parent_id', currentFolderId);
  }
  const { data: subCategories } = await catQuery;

  // 2. Fetch Files
  const { data: files } = await supabase
    .from('files')
    .select('*')
    .eq('category_id', currentFolderId);

  return (
    <main className="min-h-screen bg-[#fafafa] p-6 md:p-12 font-sans text-zinc-900 selection:bg-zinc-900 selection:text-white">
      <div className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

      <div className="relative z-10 max-w-4xl mx-auto space-y-12">
        
        {/* Simple Student Header */}
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tighter text-zinc-900 flex items-center gap-3">
             <span className="h-8 w-8 bg-zinc-900 text-white rounded-lg flex items-center justify-center text-sm font-black italic">H</span>
             Bibliothèque
          </h1>
          <p className="text-zinc-400 text-sm font-medium">Hassan Nid Bella • Cours & Ressources</p>
        </header>

        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-400">
           <Link href="/library" className="hover:text-zinc-900 transition-colors">Accueil</Link>
           {currentFolderId && (
             <>
               <span className="text-zinc-200">/</span>
               <span className="text-zinc-900">Dossier Actuel</span>
             </>
           )}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          
          {/* Folders (Subjects/Levels) */}
          {subCategories?.map(cat => (
            <Link key={cat.id} href={`?folder=${cat.id}`} className="group p-8 bg-white border border-zinc-200/60 rounded-[2.5rem] hover:border-zinc-900 hover:shadow-xl hover:shadow-zinc-200/40 transition-all duration-500">
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-zinc-50 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  📁
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-lg tracking-tight">{cat.name}</span>
                  <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Ouvrir le dossier</span>
                </div>
              </div>
            </Link>
          ))}

{/* Files (PDFs/Lessons) */}
{files?.map(file => (
  <a 
    key={file.id} 
    href={file.url} 
    target="_blank" 
    className="group p-8 bg-white border border-zinc-200/60 rounded-[2.5rem] hover:border-zinc-900 hover:shadow-xl hover:shadow-zinc-200/40 transition-all duration-500"
  >
    <div className="flex items-center gap-6">
      {/* Icon with a soft background instead of solid black */}
      <div className="w-14 h-14 bg-zinc-50 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-zinc-900 group-hover:text-white transition-colors duration-500">
        📄
      </div>
      <div className="flex flex-col">
        <span className="font-bold text-sm tracking-tight text-zinc-800 group-hover:text-zinc-900 transition-colors">
          {file.name}
        </span>
        <span className="text-[10px] text-zinc-400 font-black uppercase tracking-widest mt-1">
          Lire le cours
        </span>
      </div>
    </div>
  </a>
))}
          {/* Empty State */}
          {(!subCategories?.length && !files?.length) && (
             <div className="col-span-full py-20 text-center rounded-[3rem] border border-dashed border-zinc-200">
                <p className="text-zinc-300 font-black uppercase tracking-[0.4em] text-[10px]">Dossier vide</p>
             </div>
          )}
        </div>

      </div>
    </main>
  );
}
