import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'HROX Platform',
  description: 'Project HR Rotation and Field Operations platform'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
