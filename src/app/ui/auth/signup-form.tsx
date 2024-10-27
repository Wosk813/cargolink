import { signup } from "@/src/actions/auth";
import { Input } from "../input";
import { Button } from "../button";

export function SignupForm() {
  return (
    <form action={signup} className="flex flex-col gap-6">
      <Input title="Imię" />
      <Input title="Nazwisko" />
      <Input title="E-mail" />
      <Input title="Powtórz E-mail" />
      <Input title="Hasło" />
      <Input title="Powtórz hasło" />
      <Button type="submit">Dalej</Button>
    </form>
  );
}
