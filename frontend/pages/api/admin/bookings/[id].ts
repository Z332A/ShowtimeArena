// pages/api/admin/bookings/[id].ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || session.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden: Admins only' });
  }

  const { id } = req.query;

  try {
    switch (req.method) {
      case 'DELETE': {
        // e.g. delete booking
        return res.status(200).json({ message: 'Booking deleted' });
      }
      case 'PUT': {
        // e.g. modify booking
        return res.status(200).json({ message: 'Booking updated' });
      }
      default:
        return res.status(405).end();
    }
  } catch (error) {
    console.error('Error in admin booking route:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
