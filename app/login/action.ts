'use server'
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function handleLogin(prevState: any, formData: FormData) {
  const passwordInput = formData.get('password');
  const SECRET_PASSWORD = process.env.ADMIN_PASSWORD;

  if (passwordInput !== SECRET_PASSWORD) {
    return { error: "Mot de passe incorrect. Veuillez réessayer." };
  }

  const cookieStore = await cookies();
  cookieStore.set('admin_access', 'true', { 
    path: '/',
    httpOnly: true, 
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24
  });

  return redirect('/dashboard');
}
