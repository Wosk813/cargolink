import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import './globals.css';
import Nav from '../ui/nav/nav';
import { Inter } from 'next/font/google';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Metadata } from 'next';
import { verifySession } from '../lib/dal';
import { AccountType, Role } from '../lib/definitions';
import { logout } from '../lib/actions';

const inter = Inter({ subsets: ['latin'] });

async function getNavLinks(
  isAuth: boolean | undefined,
  role: Role | undefined,
  accountType: AccountType | undefined,
  userId: string | undefined,
): Promise<{ name: string; href: string; highlighted: boolean }[]> {
  const t = await getTranslations('nav');
  const links = [
    {
      name: t('announcements'),
      href: '/announcements',
      highlighted: false,
    },
    {
      name: t('errands'),
      href: '/errands',
      highlighted: false,
    },
    {
      name: t('search'),
      href: '/search/searchUser',
      highlighted: false,
    },
    {
      name: t('statute'),
      href: '/statute',
      highlighted: false,
    },
  ];
  if (isAuth) {
    links.push({
      name: t('profile'),
      href: `/profile/${userId}`,
      highlighted: false,
    });
    links.push({
      name: t('chats'),
      href: '/chats',
      highlighted: false,
    });
    if (accountType === AccountType.Carrier)
      links.push({
        name: t('addAnnoucement'),
        href: '/announcements/add',
        highlighted: true,
      });
    else if (accountType === AccountType.Principal)
      links.push({
        name: t('addErrand'),
        href: '/errands/add',
        highlighted: true,
      });
    if (role == Role.Moderator || role == Role.Admin) {
      links.push({
        name: t('verifyAnnouncements'),
        href: '/announcements/notVerified',
        highlighted: false,
      });
      links.push({
        name: t('verifyErrands'),
        href: '/errands/notVerified',
        highlighted: false,
      });
    }
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

  const { isAuth, role, accountType, userId } = await verifySession();

  const links = await getNavLinks(isAuth, role, accountType, userId);

  return (
    <html lang={locale}>
      <body className={`${inter.className} min-h-screen bg-slate-800 text-white`}>
        <NextIntlClientProvider messages={messages}>
          <div className="flex min-h-screen flex-col md:flex-row">
            <Nav links={links} onLogout={logout} isAuth={isAuth} role={role!} />
            <main className="relative flex-1">
              <div className="mx-6 h-full md:ml-0 md:py-8">{children}</div>
              <SpeedInsights />
            </main>
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
