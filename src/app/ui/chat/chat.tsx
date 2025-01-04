import { Button } from '../button';
import Input from '../input';
import Message from './message';
import { ButtonTypes } from '../../lib/definitions';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

type ChatProps = {
  hidden: boolean;
  showArrow: boolean;
  arrowClick: () => void;
};

export default function Chat({ hidden, showArrow, arrowClick }: ChatProps) {
  return (
    <div className={`flex w-full flex-col justify-between ${hidden ? 'hidden md:block' : ''}`}>
        <div className="flex w-full flex-col gap-2">
          {showArrow && (
            <div onClick={arrowClick} className="flex items-center gap-2">
              <ArrowLeftIcon className="h-4" />
              Pokaż czaty
            </div>
          )}
          <h1 className="text-3xl font-bold">Stefan Naworski</h1>
          <p className="text-sm text-slate-400">Ta osoba posługuje się jezykami</p>
          <p>Polish, English</p>
          <div className="flex w-full flex-col gap-4">
            <Message date={new Date()} message="Cześć, jak się masz?" myMessage={false} />
            <Message date={new Date()} message="Git jest zajebiscie" myMessage={true} />
            <Message date={new Date()} message="No i kurwa w pyte JP" myMessage={false} />
          </div>
      </div>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <Input className="w-full p-2" placeholder="Pisz tutaj" />
            <Button className="w-min p-2">Wyślij</Button>
          </div>
          <Button className="border-yellow-300 text-yellow-300" buttType={ButtonTypes.Secondary}>
            Wyślij propozycje umowy
          </Button>
        </div>
      </div>
  );
}
