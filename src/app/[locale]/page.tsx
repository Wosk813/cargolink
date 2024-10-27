import { redirect } from "@/src/i18n/routing";

export default function HomePage() {
  redirect({ href: "/announcements", locale: 'pl' });
}
