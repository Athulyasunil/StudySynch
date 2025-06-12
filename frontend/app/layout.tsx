// app/layout.tsx
import type { ReactNode } from 'react';
import './globals.css';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link href="/dist/styles.css" rel="stylesheet"></link>
      </head>
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
