import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { StoreShell } from '@/components/StoreShell';
import { Providers } from '@/components/Providers';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: {
    default: 'Vani Enterprises — Electronics, Gifts & Home Essentials',
    template: '%s | Vani Enterprises',
  },
  description:
    'Shop electronics, gifts, home decor, kitchen & lifestyle products online. Free shipping on orders above ₹999. Serving all of India.',
  keywords: ['electronics', 'home decor', 'gifts', 'kitchenware', 'Chennai', 'India shopping', 'online store'],
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen bg-stone-50 font-sans text-stone-900 antialiased">
        <Providers session={session}>
          <StoreShell>{children}</StoreShell>
        </Providers>
        <SpeedInsights />
      </body>
    </html>
  );
}
