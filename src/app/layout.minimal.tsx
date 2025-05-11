import './globals.css';

export const metadata = {
  title: 'Hospital Management System',
  description: 'A comprehensive hospital management solution',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}