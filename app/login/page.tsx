'use client'
import { useActionState } from 'react';
import { handleLogin } from './action';

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(handleLogin, null);

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#fafafa] px-4 font-sans selection:bg-black selection:text-white">
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

      <div className="relative z-10 w-full max-w-[400px]">
        <div className="mb-10 flex justify-center">
          <div className="h-12 w-12 bg-black rounded-xl flex items-center justify-center shadow-2xl rotate-3">
            <span className="text-white font-black text-xl">H</span>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-gray-200/60 p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="text-center mb-10">
            <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Espace Privé</h1>
            <p className="text-zinc-400 text-sm mt-2 font-medium">Hassan Nid Bella • Administration</p>
          </div>

          <form action={formAction} className="space-y-8">
            <div className="space-y-2">
              <label className="text-[11px] uppercase tracking-[0.2em] font-black text-zinc-400 ml-1">
                Mot de passe
              </label>
              <input 
                name="password" 
                type="password" 
                placeholder="Entrez le code secret"
                required
                className={`w-full px-6 py-4 rounded-2xl bg-zinc-50 border ${state?.error ? 'border-red-500' : 'border-zinc-100'} focus:bg-white focus:border-zinc-900 focus:ring-0 transition-all duration-300 outline-none text-zinc-900 placeholder:text-zinc-300`}
              />
              
              {/* --- THE RED ERROR MESSAGE --- */}
              {state?.error && (
                <p className="text-red-500 text-[11px] font-bold ml-1 animate-in fade-in slide-in-from-top-1">
                  {state.error}
                </p>
              )}
            </div>

            <button 
              type="submit"
              disabled={isPending}
              className="w-full bg-zinc-900 hover:bg-black text-white font-bold py-4 rounded-2xl transition-all duration-300 active:scale-[0.98] shadow-xl shadow-zinc-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {isPending ? 'Vérification...' : 'Accéder au Dashboard'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
