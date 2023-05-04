import Chat from '@/components/Chat';
import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Bookwise: Искусственный интеллект для книголюбов',
  description:
    'Открой для себя новые миры литературы - задавай вопросы нашему чат-боту с нейросетью!',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Chat />
        {children}
      </body>
    </html>
  );
}
