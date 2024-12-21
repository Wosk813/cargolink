import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import './globals.css';
import Nav from '../ui/nav/nav';
import { Inter } from 'next/font/google';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Metadata } from 'next';
import { verifySession } from '../lib/dal';
import { Role } from '../lib/definitions';
import { get } from 'http';
import { logout } from '../lib/actions';

const inter = Inter({ subsets: ['latin'] });

async function getNavLinks(role: Role | undefined): Promise<{ name: string; href: string }[]> {
  const t = await getTranslations('nav');
  const links = [
    {
      name: t('announcements'),
      href: '/announcements',
    },
    {
      name: t('errands'),
      href: '/errands',
    },
    {
      name: t('searchUser'),
      href: '/search/searchUser',
    },
  ];
  if (role === Role.User) {
    links.push({
      name: t('profile'),
      href: '/profile',
    });
    links.push({
      name: t('messages'),
      href: '/messages',
    });
  } else if (role === Role.Moderator) {
    links.push({
      name: t('profile'),
      href: '/profile',
    });
    links.push({
      name: t('messages'),
      href: '/messages',
    });
    links.push({
      name: t('moderation'),
      href: '/moderation',
    });
  } else if (role === Role.Admin) {
    links.push({
      name: t('profile'),
      href: '/profile',
    });
    links.push({
      name: t('messages'),
      href: '/messages',
    });
    links.push({
      name: t('moderation'),
      href: '/moderation',
    });
    links.push({
      name: t('admin'),
      href: '/admin',
    });
  }
  return links;
}

export const metadata: Metadata = {
  title: 'CargoLink',
  description:
    'Dołącz do nas i uprość swoje procesy logistyczne. CargoLink – Twój niezawodny partner w świecie transportu!',
};

export default async function LocaleLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const params = await props.params;

  const { locale } = params;

  const { children } = props;

  const messages = await getMessages();

  // const { isAuth } = await verifySession();

  const links = await getNavLinks(Role.Admin);

  return (
    <html lang={locale}>
      <body className={`${inter.className} min-h-screen bg-slate-800 text-white`}>
        <NextIntlClientProvider messages={messages}>
          <div className="flex min-h-screen flex-col md:flex-row">
            <Nav links={links} onLogout={logout} />
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
