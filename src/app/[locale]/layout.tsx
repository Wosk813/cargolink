import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import './globals.css';
import Nav from '../ui/nav/nav';
import { Inter } from 'next/font/google';
import { SpeedInsights } from '@vercel/speed-insights/next';

const inter = Inter({ subsets: ['latin'] });

export default async function LocaleLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const params = await props.params;

  const { locale } = params;

  const { children } = props;

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={`${inter.className} min-h-screen bg-slate-800 text-white`}>
        <NextIntlClientProvider messages={messages}>
          <div className="flex min-h-screen flex-col md:flex-row">
            <Nav />
            <main className="relative flex-1">
              <div className="h-full px-5 md:py-8">{children}</div>
              <SpeedInsights />
            </main>
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
