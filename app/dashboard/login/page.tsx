// app/dashboard/login/page.tsx
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default function LoginPage() {
  async function handleLogin(formData: FormData) {
    'use server'
    const password = formData.get('password');
    
    // Change this to your actual secret password
    if (password === '1337_DAD_SECRET') {
      const cookieStore = await cookies();
      cookieStore.set('admin_access', 'true', { 
        httpOnly: true, 
        secure: true, 
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 // 24 hours
      });
      redirect('/dashboard');
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-black text-white w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4 text-xl font-bold">
            D
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Access</h1>
          <p className="text-gray-500 text-sm mt-2">Enter your password to manage the shop</p>
        </div>

        {/* Form */}
        <form action={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Secret Password
            </label>
            <input 
              name="password" 
              type="password" 
              placeholder="••••••••"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none text-black"
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-3 rounded-xl transition-all active:scale-95 shadow-lg shadow-gray-200"
          >
            Sign In
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-8">
          &copy; {new Date().getFullYear()} Dad's Website • Built by Soukaina
        </p>
      </div>
    </main>
  );
}
