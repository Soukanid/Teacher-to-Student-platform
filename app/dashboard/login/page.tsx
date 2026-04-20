export default function LoginPage() {
  async function handleLogin(formData: FormData) {
    'use server'
    const password = formData.get('password');
    
    // Set your secret password here
    if (password === '1337_DAD_SECRET') {
      const { cookies } = await import('next/headers');
      (await cookies()).set('admin_access', 'true', { httpOnly: true });
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form action={handleLogin} className="p-8 border rounded shadow">
        <h2 className="mb-4">Enter Admin Password</h2>
        <input name="password" type="password" className="border p-2 mb-4" />
        <button className="bg-black text-white px-4 py-2">Login</button>
      </form>
    </div>
  );
}
