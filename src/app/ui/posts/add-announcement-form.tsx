import { Button } from '../button';
import Input from '../input';

export default function AddAnnoucementForm() {
  return (
    <form action="" className="flex flex-col gap-2 pb-4">
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="flex w-full flex-col gap-2">
          <p className="text-xl">Informacje o trasie</p>
          <Input title="Miasto startu" />
          <Input title="Ulica" />
          <Input title="Data i godzina wyjazdu" type="date" />
          <Input title="Miasto docelowe" />
          <Input title="Ulica" />
          <Input title="Data i godzina dotarcia" type="date" />
        </div>
        <div className="flex-col gap-4 flex">
          <div className="flex flex-col gap-2">
            <p className="text-xl">Ogłoszenie</p>
            <Input title="Tytuł ogłoszenia" />
            <Input multiline title="opis ogłoszenia (niewymagane)" />
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-xl">Informacje o pojeździe</p>
            <div className="flex gap-2">
              <Input title="Marka" />
              <Input title="Model" />
            </div>
            <div className="flex gap-2">
              <Input title="Maksymalna waga towaru (kg)" className="text-center text-xl" />
              <Input title="Maksymalne wymiary towaru" className="text-center text-xl" />
              <Input title="Maksymalna wysokość towaru (cm)" className="text-center text-xl" />
            </div>
            <p className="text-center text-sm">
              <span className="text-slate-400">Podaj wymiary w euro paletach</span> (np. 2x1)
            </p>
            <p className="text-center text-sm text-slate-400">
              Zanim Twoje ogłoszenie o planowanej trasie trafi do informacji publicznej, musi zostać
              ono zatwierdzone przez jednego z moderatorów.
            </p>
          </div>
        </div>
      </div>
      <Button>Dodaj ogłoszenie o planowanej trasie</Button>
    </form>
  );
}
