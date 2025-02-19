// pages/api/admin/block.ts
import type { NextApiRequest, NextApiResponse } from 'next';
// import Block from '../../../models/Block';
import { getSession } from 'next-auth/react';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  if (!session || session.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { startTime, endTime, reason } = req.body;
    // e.g. validate times, ensure endTime > startTime, etc.

    // store in DB
    // const block = await Block.create({ startTime, endTime, reason, createdBy: session.user.email });

    return res.status(201).json({
      message: 'Time range blocked off successfully',
      // block
    });
  } catch (error) {
    console.error('Error blocking time range:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
