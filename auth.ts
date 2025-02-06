import NextAuth from 'next-auth';
import { z } from 'zod';
// import postgres from 'postgres';
import { sql } from '@vercel/postgres';
import bcrypt from 'bcrypt';
import Credentials from 'next-auth/providers/credentials';
import type { User } from '@/app/lib/definitions';
import { authConfig } from './auth.config';

// const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

async function getUser(email: string): Promise<User | undefined> {
  try {
    const result = await sql<User>`SELECT * FROM users WHERE email=${email}`;

    return result.rows[0];
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}

// NextAuth passed cinfig returns an object with auth, signIn, and signOut properties
export const { auth, signIn, signOut } = NextAuth({
  // COntain other properties from auth.config.ts
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);

          if (!user) return null;
          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (passwordsMatch) return user;
        }

        return null;
      },
    }),
  ],
});
