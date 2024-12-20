import { Button } from '../button';
import { Input } from '../input';
import { useTranslations } from 'next-intl';

export default function LoginForm() {
  const t = useTranslations('login');
  return (
    <form className="flex flex-col gap-4 text-black">
      <Input type="email" name="email" title="Email" required />
      <Input type="password" name="password" title="Password" required />
      <Button className="mt-4">{t('login')}</Button>
    </form>
  );
}
