import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Confere Aí — Assistente Inteligente Contra Desinformação e Golpes',
  description:
    'Antes de acreditar, clicar ou compartilhar, confira. Análise inteligente e segura de mensagens, links e boletos com privacidade garantida.',
  robots: 'index, follow',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0D9488',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="h-full">
      <body className="h-full flex flex-col font-sans">
        <main className="flex-1 w-full max-w-lg mx-auto bg-white min-h-screen shadow-sm sm:border-x sm:border-gray-200 flex flex-col">
          {children}
        </main>
      </body>
    </html>
  );
}
