import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import "./globals.css";
import Nav from "../ui/nav/nav";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body
        className={`${inter.className} min-h-screen bg-slate-800 text-white`}
      >
        <NextIntlClientProvider messages={messages}>
          <div className="flex flex-col md:flex-row min-h-screen">
            <Nav />
            <main className="flex-1 relative">
              <div className="px-5 md:py-8 h-full">{children}</div>
            </main>
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}