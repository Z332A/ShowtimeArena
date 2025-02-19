// pages/api/auth/[...nextauth].ts
import NextAuth, { NextAuthOptions, Session } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';

import connectDB from 'lib/db';         // or '../../../../lib/db'
import User from 'models/User';         // or '../../../../models/User'
import type { IUser } from 'models/User'; // Make sure IUser has phone if needed

interface MyAuthUser {
  id: string;
  email: string;
  role: string;
  name?: string;
  phone?: string; // optional if your schema includes phone
}

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: string;
      name?: string;
      phone?: string;
    };
  }
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },

      async authorize(credentials): Promise<MyAuthUser | null> {
        if (!credentials) return null;

        // 1) Connect to DB
        await connectDB();

        // 2) Find user doc
        const userDoc: IUser | null = await User.findOne({ email: credentials.email });
        if (!userDoc) return null;

        // 3) Compare password
        const validPassword = await bcrypt.compare(credentials.password, userDoc.passwordHash);
        if (!validPassword) return null;

        // 4) Return typed user with _id as string
        return {
          id: userDoc._id.toString(),
          email: userDoc.email,
          role: userDoc.role,
          name: userDoc.name ?? '',
          phone: userDoc.phone ?? '', // only if you have phone in IUser
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      // If this is the initial sign-in, attach user data to the token
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.name = user.name;
        token.phone = (user as MyAuthUser).phone;
      }
      return token;
    },

    async session({ session, token }) {
      if (token.id) {
        session.user.id = token.id as string;
      }
      if (token.role) {
        session.user.role = token.role as string;
      }
      if (token.name) {
        session.user.name = token.name as string;
      }
      if (token.phone) {
        session.user.phone = token.phone as string;
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);
