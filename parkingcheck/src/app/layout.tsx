import '../styles/style1.css';
import { ReactNode } from 'react';

export const metadata = {
  title: 'Parking Check',
  description: 'Sistema de Estacionamientos de la UCT',
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        {children}
      </body>
    </html>
  );
}
