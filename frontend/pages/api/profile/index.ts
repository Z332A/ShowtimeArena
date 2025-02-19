// pages/api/profile/index.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]'; // check # of ../
import connectDB from 'lib/db';
import User from 'models/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // 1) Retrieve user session
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // 2) Connect to DB
  await connectDB();

  // 3) Find current user doc
  const currentUser = await User.findById(session.user.id);

  if (!currentUser) {
    return res.status(404).json({ message: 'User not found' });
  }

  switch (req.method) {
    case 'GET':
      // Return user data
      return res.status(200).json({
        email: currentUser.email,
        role: currentUser.role,
        name: currentUser.name,
        phone: currentUser.phone,
        avatarUrl: currentUser.avatarUrl, 
      });

    case 'PATCH':
    case 'PUT':
      try {
        const { name, phone, avatarUrl } = req.body;
        if (name) currentUser.name = name;
        if (phone) currentUser.phone = phone;
        if (avatarUrl) currentUser.avatarUrl = avatarUrl;

        await currentUser.save();
        return res.status(200).json({ message: 'Profile updated successfully' });
      } catch (err) {
        console.error('Error updating profile:', err);
        return res.status(500).json({ message: 'Profile update failed' });
      }

    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}
