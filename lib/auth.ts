import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { supabase } from './supabase';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email:    { label: 'Email',    type: 'email'    },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;

        const email = credentials.email.toLowerCase().trim();

        let { data: user } = await supabase
          .from('users')
          .select('id, name, email, password, role')
          .eq('email', email)
          .single();

        // Auto-seed admin on first login
        if (
          !user &&
          process.env.ADMIN_EMAIL?.toLowerCase() === email &&
          process.env.ADMIN_PASSWORD
        ) {
          const hashed = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);
          const { data: created } = await supabase
            .from('users')
            .insert({ name: 'Admin', email, password: hashed, role: 'admin' })
            .select('id, name, email, password, role')
            .single();
          user = created;
        }

        if (!user) return null;

        const valid = await bcrypt.compare(credentials.password, user.password);
        if (!valid) return null;

        return { id: user.id, name: user.name, email: user.email, role: user.role };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = (user as { role?: string }).role;
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { role?: unknown; id?: string }).role = token.role;
        (session.user as { id?: string }).id = token.sub;
      }
      return session;
    },
  },
  pages: { signIn: '/auth/login' },
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET,
};
