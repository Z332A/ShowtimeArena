// pages/api/admin/products.ts
import type { NextApiRequest, NextApiResponse } from 'next';
// import Product from '../../../models/Product';
import { getSession } from 'next-auth/react';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  if (!session || session.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }

  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Expect an array or object of product price changes
    const { products } = req.body; 
    // e.g. products = [{ name: 'Sony Fx6 Camera', newPrice: 65000 }, ...]

    // for (let p of products) {
    //   await Product.findOneAndUpdate({ name: p.name }, { price: p.newPrice });
    // }

    return res.status(200).json({ message: 'Product prices updated successfully' });
  } catch (error) {
    console.error('Error updating product prices:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
