import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function AdminDashboard() {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get('admin_access')?.value === 'true';

  // If not "logged in", kick them to the login page
  if (!isAdmin) {
    redirect('/dashboard/login');
  }

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">Dad's Admin Panel</h1>
      {/* Your form to add/edit products goes here */}
    </div>
  );
}
