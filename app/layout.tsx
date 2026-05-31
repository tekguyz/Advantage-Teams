import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0d1117' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://advantage-teams.vercel.app/'),
  title: 'Advantage Software Workspace',
  description: 'Operations console bridging hardware telephony registers with Zoho CRM accounts.',
  icons: {
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='20' fill='%230052cc'/%3E%3Cpath d='M50 16 L84 50 L50 84 L16 50 Z' fill='%23ffffff'/%3E%3Cpath d='M50 30 L70 50 L50 70 L30 50 Z' fill='%230052cc'/%3E%3Ccircle cx='50' cy='50' r='10' fill='%23fffae6'/%3E%3C/svg%3E",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Advantage',
  },
  openGraph: {
    title: 'Advantage Software Workspace',
    description: 'Operations console bridging hardware telephony registers with Zoho CRM accounts.',
    url: 'https://advantage-teams.vercel.app/dashboard',
    siteName: 'Advantage Software',
    images: [
      {
        url: 'https://advantage-teams.vercel.app/api/og',
        width: 1200,
        height: 630,
        alt: 'Advantage Software Operations Console',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Advantage Software Workspace',
    description: 'Operations console bridging hardware telephony registers with Zoho CRM accounts.',
    images: ['https://advantage-teams.vercel.app/api/og'],
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
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="mobile-web-app-capable" content="yes" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const storedTheme = localStorage.getItem('theme');
                  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  const isDark = storedTheme === 'dark' || (!storedTheme && prefersDark);
                  if (isDark) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                  
                  // Instantly apply correct theme-color meta tag during synchronous initial script execution to avoid layout flashes
                  let meta = document.querySelector('meta[name="theme-color"]');
                  if (!meta) {
                    meta = document.createElement('meta');
                    meta.setAttribute('name', 'theme-color');
                    document.head.appendChild(meta);
                  }
                  meta.setAttribute('content', isDark ? '#0d1117' : '#ffffff');
                } catch (e) {}
              })();
            `
          }}
        />
      </head>
      <body suppressHydrationWarning className="h-full font-sans antialiased bg-canvas-bg text-text-charcoal animate-fadeIn">
        {children}
      </body>
    </html>
  );
}
