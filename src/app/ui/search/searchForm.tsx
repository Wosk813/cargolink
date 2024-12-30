import Input from '../input';
import { Button } from '../button';

export default function SearchForm() {
  return (
    <div className="flex flex-col gap-4">
      <Input title="Imię" />
      <Input title="Nazwisko" />
      <Input title="E-mail" />
      <Input title="Typ konta" />
      <Button>
        <p>Szukaj</p>
      </Button>
    </div>
  );
}
