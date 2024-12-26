export default function Description({ desc }: { desc: string | undefined }) {
  return (
    <div className="flex h-full flex-col rounded-md bg-slate-700 p-2">
      <p className="text-x">Opis</p>
      <div className="mt-4 flex-1 rounded-md bg-slate-800 p-2">{desc}</div>
    </div>
  );
}
