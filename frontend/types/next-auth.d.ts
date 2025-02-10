// /types/next-auth.d.ts

import { DefaultSession, DefaultUser } from 'next-auth';

/**
 * Extends NextAuth's default types to ensure session.user is never undefined
 * and contains a guaranteed `id` and `role`.
 */
declare module 'next-auth' {
  interface User extends DefaultUser {
    id: string;
    role: string;
  }

  interface Session {
    user: {
      id: string;
      role: string;
      // Keep existing default user fields (name, email, image)
    } & DefaultSession['user'];
  }
}
