import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'WeldTrack — Kaynak Atölyesi Yönetim Platformu',
  description: 'Kaynak ve metal işleri atölyeleri için profesyonel iş emri, envanter ve fatura yönetim sistemi',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className="dark">
      <body className="bg-steel-950 text-steel-100 antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
