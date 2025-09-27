import type { Metadata } from 'next';
import { Inter, Cinzel } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });
const cinzel = Cinzel({ subsets: ['latin'], variable: '--font-cinzel' });

export const metadata: Metadata = {
  title: "Athena's Journal",
  description: 'A conversational, AI-powered journaling app that transforms self-reflection into a supportive dialogue',
  keywords: ['journaling', 'AI', 'mental wellness', 'reflection', 'Athena'],
  authors: [{ name: 'GirlHacks 2025 Team' }],
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#D4AF37',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${cinzel.variable}`}>
        {children}
      </body>
    </html>
  );
}

