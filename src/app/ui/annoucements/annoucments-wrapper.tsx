import Annoucement from './annoucment';

export default function AnnoucmentsWrapper() {
  return (
    <div className="flex flex-col gap-4">
      <Annoucement
        title="Zamierzam wybrać się z Wrocławia do Berlina"
        from="PL, Wrocław"
        to="DE, Berlin"
        departureDate={new Date()}
        arrivalDate={new Date(new Date().setDate(new Date().getDate() + 2))}
        carProps={{ maxWeight: 10000, maxSize: { x: 2, y: 1, height: 200 } }}
      />
      <Annoucement
        title="Zamierzam wybrać się z Wrocławia do Berlina"
        from="PL, Wrocław"
        to="DE, Berlin"
        departureDate={new Date()}
        arrivalDate={new Date(new Date().setDate(new Date().getDate() + 2))}
        carProps={{ maxWeight: 10000, maxSize: { x: 2, y: 1, height: 200 } }}
      />
    </div>
  );
}
