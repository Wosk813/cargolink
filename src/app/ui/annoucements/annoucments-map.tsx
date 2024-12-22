import { Button } from '../button';
import { ButtonTypes } from '../../lib/definitions';

export default function AnnoucementsMapButt() {
  return (
    <div>
      <Button buttType={ButtonTypes.Secondary} className="border-yellow-300 text-yellow-300">
        Otwórz mapę tras
      </Button>
    </div>
  );
}
