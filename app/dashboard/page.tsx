import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

export default async function AdminDashboard({ searchParams }: { searchParams: Promise<{ folder?: string }> }) {
  const params = await searchParams;
  const currentFolderId = params.folder || null;

  // Fetch folders and files for the current level
  const { data: subCategories } = await supabase.from('categories').select('*').eq('parent_id', currentFolderId);
  const { data: files } = await supabase.from('files').select('*').eq('category_id', currentFolderId);

  // ACTION: Create a Sub-Category (Folder)
  async function addSubCategory(formData: FormData) {
    'use server'
    const name = formData.get('name');
    await supabase.from('categories').insert([{ name, parent_id: currentFolderId }]);
    revalidatePath('/dashboard');
  }

  // ACTION: Upload a File
  async function uploadFile(formData: FormData) {
    'use server'
    const file = formData.get('file') as File;
    if (!file.name) return;

    // 1. Upload to Supabase Storage
    const fileName = `${Date.now()}-${file.name}`;
    const { data: storageData, error: uploadError } = await supabase.storage
      .from('school-files')
      .upload(fileName, file);

    if (storageData) {
      const { data: { publicUrl } } = supabase.storage.from('school-files').getPublicUrl(fileName);

      // 2. Save the link in the database
      await supabase.from('files').insert([{
        name: file.name,
        url: publicUrl,
        category_id: currentFolderId
      }]);
    }
    revalidatePath('/dashboard');
  }

  return (
    <main className="p-8 max-w-5xl mx-auto space-y-10 font-sans">
      <div className="flex justify-between items-center border-b pb-6">
        <h1 className="text-3xl font-black tracking-tight text-gray-900">
          {currentFolderId ? 'Sub-Folder' : 'Grade Levels'}
        </h1>
        {currentFolderId && (
          <a href="/dashboard" className="text-sm bg-gray-100 px-4 py-2 rounded-full hover:bg-gray-200 transition">
            ← Back to Grades
          </a>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Form: New Folder */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h2 className="font-bold text-gray-700 mb-4 uppercase text-xs tracking-widest">Create Course / Sub-Folder</h2>
          <form action={addSubCategory} className="flex flex-col gap-3">
            <input name="name" placeholder="e.g. Mathematics" className="border p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" required />
            <button className="bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition">Create Folder</button>
          </form>
        </div>

        {/* Form: Upload File */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h2 className="font-bold text-gray-700 mb-4 uppercase text-xs tracking-widest">Upload Lesson (PDF/Doc)</h2>
          {currentFolderId ? (
            <form action={uploadFile} className="flex flex-col gap-3">
              <input type="file" name="file" className="border p-2 rounded-xl text-sm" required />
              <button className="bg-black text-white font-bold py-3 rounded-xl hover:bg-gray-800 transition">Upload File</button>
            </form>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400 italic text-sm text-center">
              Please enter a Grade folder first <br/> to upload specific lessons.
            </div>
          )}
        </div>
      </div>

      {/* Grid: View Contents */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-800">Contents:</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {subCategories?.map(cat => (
            <a key={cat.id} href={`?folder=${cat.id}`} className="p-6 bg-white border border-gray-100 rounded-2xl flex items-center gap-4 hover:border-blue-500 hover:shadow-md transition group">
              <span className="text-3xl group-hover:scale-110 transition">📁</span>
              <span className="font-bold text-gray-700">{cat.name}</span>
            </a>
          ))}
          {files?.map(file => (
            <a key={file.id} href={file.url} target="_blank" className="p-6 bg-gray-50 border border-transparent rounded-2xl flex items-center gap-4 hover:bg-white hover:border-green-500 transition">
              <span className="text-3xl">📄</span>
              <span className="font-medium text-gray-600 truncate">{file.name}</span>
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}
