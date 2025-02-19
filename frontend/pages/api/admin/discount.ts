// pages/api/admin/discount.ts
import type { NextApiRequest, NextApiResponse } from 'next';
// import your DB models, etc. e.g. import Discount from '../../../models/Discount';
import { getSession } from 'next-auth/react'; // or your auth check

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // 1) Check method
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // 2) Check if user is admin
  const session = await getSession({ req });
  if (!session || session.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden: Admins only' });
  }

  try {
    const { code, discountPercent, expiryDate } = req.body;
    // Validate input (code unique, discount in range, etc.)

    // e.g. create discount in DB
    // const newDiscount = await Discount.create({ code, discountPercent, expiryDate });

    return res.status(201).json({
      message: 'Discount code created successfully',
      // discount: newDiscount,
    });
  } catch (error) {
    console.error('Error creating discount code:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
