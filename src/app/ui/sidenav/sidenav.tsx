import BottomButtons from "./bottom-buttons";
import NavLinks from "./nav-links";

export default function SideNav() {
  return (
    <div className="flex flex-col w-64 bg-slate-800 h-dvh text-white px-6">
      <h1 className="text-4xl text-center font-bold py-8">CargoLink</h1>
      <div>
        <NavLinks />
      </div>
      <div className="mt-auto">
        <BottomButtons />
      </div>
    </div>
  );
}
