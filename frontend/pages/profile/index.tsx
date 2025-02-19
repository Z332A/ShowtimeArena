// pages/profile/index.tsx
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';

export default function MyProfilePage() {
  const { data: session } = useSession();
  const [userData, setUserData] = useState<any>(null); // Adjust with a proper type
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user?.id) {
      // fetch user details from an API route
      fetchUserProfile();
    }
  }, [session]);

  const fetchUserProfile = async () => {
    try {
      const res = await axios.get('/api/profile'); // or /api/users/me
      setUserData(res.data);
    } catch (err) {
      setError('Failed to load profile');
    }
  };

  if (!session) {
    return <p>Please sign in to view your profile.</p>;
  }

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <h1>My Profile</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Display or edit user info */}
      {userData && (
        <>
          <p>Email: {userData.email}</p>
          <p>Role: {userData.role}</p>
          {/* Possibly show an avatar image */}
          {userData.avatarUrl && <img src={userData.avatarUrl} alt="Profile Avatar" />}
          {/* Additional forms for updating phone, name, avatar, etc. */}
        </>
      )}
    </div>
  );
}
