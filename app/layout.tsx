import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Advantage Teams',
  description: 'Clean high-density enterprise operations console and performance matrix tracker',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body suppressHydrationWarning className="h-full font-sans antialiased bg-white text-[#172b4d]">
        {children}
      </body>
    </html>
  );
}
