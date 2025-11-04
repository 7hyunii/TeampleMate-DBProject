import type { Metadata } from 'next';

import '../styles/globals.css';
import { AuthProvider } from '../components/AuthProvider';

export const metadata: Metadata = {
  title: 'Teample Mate',
  description: '팀 프로젝트 매칭 및 상호 평가 시스템',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}