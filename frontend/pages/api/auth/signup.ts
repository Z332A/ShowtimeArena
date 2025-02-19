// pages/api/auth/signup.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from 'lib/db';
import User from 'models/User';
import bcrypt from 'bcryptjs';

/**
 * The request body structure for signup:
 * - email, phone, password, name (optional)
 */
interface SignupRequestBody {
  email: string;
  phone: string;
  password: string;
  name?: string;
}

/**
 * A simple password policy ensuring:
 * 1) At least 8 characters
 * 2) At least 1 uppercase letter
 * 3) At least 1 digit
 * 4) At least 1 special character
 */
const passwordPolicyRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;

export default async function signupHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    // Ensure MongoDB is connected
    await connectDB();

    // Extract fields from request body
    const { email, phone, password, name }: SignupRequestBody = req.body;

    // Validate mandatory fields
    if (!email || !phone || !password) {
      return res
        .status(400)
        .json({ message: 'Email, phone, and password are required' });
    }

    // Check password policy
    if (!passwordPolicyRegex.test(password)) {
      return res.status(400).json({
        message:
          'Password must be at least 8 chars long, include an uppercase letter, a digit, and a special character.',
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user document
    const newUser = await User.create({
      email,
      phone,
      passwordHash: hashedPassword,
      name: name?.trim() || '',
      role: 'TEAM_MEMBER', // Default role, adjust as needed
    });

    // Respond with success and basic user info
    return res.status(201).json({
      message: 'User created successfully',
      user: {
        id: newUser._id,
        email: newUser.email,
        phone: newUser.phone,
        name: newUser.name,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error('Error during signup:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
