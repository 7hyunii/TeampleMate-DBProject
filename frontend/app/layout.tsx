import type { Metadata } from 'next';

import '../styles/globals.css';
import { AuthProvider } from '../components/auth/AuthProvider';
import { Navigation } from '@/components/layout/Navigation';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Teample Mate',
  description: '팀 프로젝트 매칭을 위한 서비스',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
        <AuthProvider>
          <Navigation />
          <main className="container mx-auto px-4 py-4 md:py-8 pb-24 md:pb-8 flex-1">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
