import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import "./globals.css";
import Nav from "../ui/sidenav/sidenav";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body
        className={`${inter.className} min-h-screen bg-slate-800 text-white`}
      >
        <NextIntlClientProvider messages={messages}>
          <div className="flex flex-col md:flex-row">
            <Nav />
            <div className="px-5 md:py-8">{children}</div>
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
