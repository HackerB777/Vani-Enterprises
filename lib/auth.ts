import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { getSupabaseAdmin } from './supabase';

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

        // ── Admin: verify directly against env vars (no DB needed) ──
        const adminEmail    = process.env.ADMIN_EMAIL?.toLowerCase().trim();
        const adminPassword = process.env.ADMIN_PASSWORD;
        if (adminEmail && adminPassword && email === adminEmail) {
          // Support both plain-text and bcrypt-hashed ADMIN_PASSWORD
          const valid = adminPassword.startsWith('$2')
            ? await bcrypt.compare(credentials.password, adminPassword)
            : credentials.password === adminPassword;
          if (!valid) return null;
          return { id: 'admin', name: 'Admin', email, role: 'admin' };
        }

        // ── Regular users: look up in Supabase ──
        try {
          const supabase = getSupabaseAdmin();
          const { data: user } = await supabase
            .from('users')
            .select('id, name, email, password, role')
            .eq('email', email)
            .single();

          if (!user) return null;

          const valid = await bcrypt.compare(credentials.password, user.password);
          if (!valid) return null;

          return { id: user.id, name: user.name, email: user.email, role: user.role };
        } catch {
          return null;
        }
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
