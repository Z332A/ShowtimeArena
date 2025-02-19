// pages/api/paystack/verify.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

// Describe the shape of Paystack's verify response
interface PaystackVerifyData {
  status: boolean;
  message: string;
  data: {
    status: string;
    reference: string;
    amount: number;
    // ... other fields
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { reference, bookingId } = req.body;
  if (!reference || !bookingId) {
    return res.status(400).json({ message: 'Missing reference or bookingId' });
  }

  try {
    const verifyResponse = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    });

    // Instead of typing verifyResponse as AxiosResponse<PaystackVerifyData>,
    // we do a type assertion on verifyResponse.data
    const paystackData = verifyResponse.data as PaystackVerifyData;

    if (
      paystackData.status &&
      paystackData.data &&
      paystackData.data.status === 'success'
    ) {
      // Payment success
      return res.status(200).json({ message: 'Payment verified successfully' });
    } else {
      return res.status(400).json({ message: 'Payment not successful or not found' });
    }
  } catch (error) {
    console.error('Error verifying Paystack payment:', error);
    return res
      .status(500)
      .json({ message: 'Internal server error verifying payment' });
  }
}
