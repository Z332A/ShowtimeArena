// pages/admin/dashboard.tsx
import React from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  // If no session or not admin, redirect or show error
  if (!session || session.user.role !== 'admin') {
    if (typeof window !== 'undefined') {
      router.push('/auth/signin');
    }
    return null;
  }

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Welcome, {session.user.email}</p>
      {/* admin content */}
    </div>
  );
}
