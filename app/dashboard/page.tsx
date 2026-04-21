import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';
import Link from 'next/link';

export default async function AdminDashboard({ 
  searchParams 
}: { 
  searchParams: Promise<{ folder?: string }> 
}) {
  const params = await searchParams;
  const currentFolderId = params.folder || null;

  // --- 1. RÉCUPÉRATION DES DONNÉES ---
  let catQuery = supabase.from('categories').select('*');
  if (!currentFolderId) {
    catQuery = catQuery.is('parent_id', null); // Niveau Racine (7ème, 8ème, etc)
  } else {
    catQuery = catQuery.eq('parent_id', currentFolderId); // Dossier spécifique
  }
  const { data: subCategories } = await catQuery;

  const { data: files } = await supabase
    .from('files')
    .select('*')
    .eq('category_id', currentFolderId);


  // --- 2. ACTIONS SERVEUR ---
  async function addSubCategory(formData: FormData) {
    'use server'
    const name = formData.get('name');
    const { error } = await supabase.from('categories').insert([
      { name, parent_id: currentFolderId }
    ]);
    if (error) console.error("Erreur de création:", error);
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
  }
}
  // --- 3. RENDU UI ---
  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-10 font-sans text-gray-900">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* En-tête */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-3xl font-black text-blue-600">Hassan Nid Bella</h1>
            <p className="text-gray-500 text-sm">Gestion : {currentFolderId ? 'Contenu du dossier' : 'Niveaux Scolaires'}</p>
          </div>
          {currentFolderId && (
            <Link href="/dashboard" className="bg-gray-100 hover:bg-gray-200 px-5 py-2 rounded-2xl text-sm font-bold transition flex items-center gap-2">
              🏠 Retour aux Niveaux
            </Link>
          )}
        </div>

        {/* Grille d'Actions: Formulaires */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Créer un Dossier */}
          <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h2 className="text-xs uppercase tracking-widest font-bold text-gray-400 mb-4">Nouveau Dossier / Matière</h2>
            <form action={addSubCategory} className="flex gap-2">
              <input 
                name="name" 
                placeholder="Nom du dossier (ex: Mathématiques)..." 
                className="flex-1 bg-gray-50 border-none rounded-2xl p-3 focus:ring-2 focus:ring-blue-500 outline-none" 
                required 
              />
              <button className="bg-blue-600 text-white px-6 rounded-2xl font-bold hover:bg-blue-700 transition text-sm">Créer</button>
            </form>
          </section>

          {/* Téléverser un Fichier */}
          <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h2 className="text-xs uppercase tracking-widest font-bold text-gray-400 mb-4">Ajouter un Document</h2>
            {currentFolderId ? (
              <form action={uploadFile} className="flex gap-2">
                <input type="file" name="file" className="flex-1 text-sm pt-2" required />
                <button className="bg-black text-white px-6 rounded-2xl font-bold hover:bg-gray-800 transition text-sm">Publier</button>
              </form>
            ) : (
              <p className="text-sm text-gray-400 italic pt-2">Sélectionnez un niveau pour ajouter des fichiers.</p>
            )}
          </section>
        </div>

        {/* Affichage du Contenu */}
        <section className="space-y-4">
          <h3 className="text-xl font-bold px-2 text-gray-700">Bibliothèque de Contenu</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            
            {/* État Vide */}{/* Dossiers */}
{subCategories?.map(cat => (
  <div key={cat.id} className="group relative">
    <Link href={`?folder=${cat.id}`} className="block p-6 bg-white border border-gray-100 rounded-3xl hover:border-blue-400 hover:shadow-md transition">
      <div className="flex items-center gap-4">
        <span className="text-4xl group-hover:scale-110 transition">📁</span>
        <span className="font-bold text-lg truncate">{cat.name}</span>
      </div>
    </Link>
    <form action={async () => { 'use server'; await deleteItem(cat.id, 'folder'); }}>
      <button className="absolute -top-2 -right-2 bg-red-500 text-white w-7 h-7 rounded-full text-xs opacity-0 group-hover:opacity-100 transition shadow-lg flex items-center justify-center cursor-pointer hover:bg-red-600 hover:scale-110 active:scale-95">
        ×
      </button>
    </form>
  </div>
))}

{/* Fichiers */}
{files?.map(file => (
  <div key={file.id} className="group relative">
    <a href={file.url} target="_blank" className="block p-6 bg-blue-50 border border-transparent rounded-3xl hover:bg-white hover:border-blue-200 transition">
      <div className="flex items-center gap-4 text-blue-700">
        <span className="text-4xl">📄</span>
        <span className="font-medium truncate text-sm">{file.name}</span>
      </div>
    </a>
    <form action={async () => { 'use server'; await deleteItem(file.id, 'file'); }}>
      <button className="absolute -top-2 -right-2 bg-red-500 text-white w-7 h-7 rounded-full text-xs opacity-0 group-hover:opacity-100 transition shadow-lg flex items-center justify-center cursor-pointer hover:bg-red-600 hover:scale-110 active:scale-95">
        ×
      </button>
    </form>
  </div>
))}
            {(!subCategories?.length && !files?.length) && (
              <div className="col-span-full py-20 text-center text-gray-300 border-2 border-dashed border-gray-200 rounded-3xl italic">
                Ce dossier est vide pour le moment.
              </div>
            )}
          </div>
        </section>

      </div>
    </main>
  );
}
