export default function Description({ desc }: { desc: string | undefined }) {
  return (
    <div className="rounded-md bg-slate-700 p-2">
      <p className="text-xl">Opis</p>
      <div className="mt-4 rounded-md bg-slate-800 p-2">{desc}</div>
    </div>
  );
}
