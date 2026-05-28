import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://advantage-teams.vercel.app/'),
  title: 'Advantage Teams Workspace',
  description: 'Clean high-density enterprise operations console and performance matrix tracker',
  icons: {
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M50 5 L95 50 L50 95 L5 50 Z' fill='none' stroke='currentColor' stroke-width='4'/%3E%3Cpath d='M50 5 Q50 50 95 50 Q50 50 50 95 Q50 50 5 50 Q50 50 50 5' fill='currentColor' opacity='0.15'/%3E%3Ccircle cx='50' cy='50' r='18' fill='%230052cc'/%3E%3C/svg%3E",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const storedTheme = localStorage.getItem('theme');
                  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (storedTheme === 'dark' || (!storedTheme && prefersDark)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `
          }}
        />
      </head>
      <body suppressHydrationWarning className="h-full font-sans antialiased bg-canvas-bg text-text-charcoal">
        {children}
      </body>
    </html>
  );
}
