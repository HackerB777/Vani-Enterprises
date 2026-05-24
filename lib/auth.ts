import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { connectDB } from './mongodb';
import { User } from './models/User';

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

        await connectDB();

        const email = credentials.email.toLowerCase().trim();
        type UserDoc = { _id: unknown; name: string; email: string; password: string; role: string };
        let user = await User.findOne({ email }).lean<UserDoc>();

        // Auto-seed admin from env vars on first login
        if (
          !user &&
          process.env.ADMIN_EMAIL?.toLowerCase() === email &&
          process.env.ADMIN_PASSWORD
        ) {
          const hashed = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);
          const created = await User.create({ name: 'Admin', email, password: hashed, role: 'admin' });
          user = created.toObject() as UserDoc;
        }

        if (!user) return null;

        const valid = await bcrypt.compare(credentials.password, user.password);
        if (!valid) return null;

        return { id: String(user._id), name: user.name, email: user.email, role: user.role as 'admin' | 'user' };
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
