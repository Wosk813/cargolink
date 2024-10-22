import LoginForm from "@/src/app/ui/login/login-form";

export default function Page() {
  return (
    <div className="md:bg-slate-800 h-full px-12 py-8 w-full md:w-6/12 md:justify-center flex flex-col gap-6">
      <h1 className="text-5xl font-bold md:text-center">CargoLink</h1>
      <p className="md:text-slate-400 text-xl">
        Dołącz do nas i uprość swoje procesy logistyczne. CargoLink – Twój
        niezawodny partner w świecie transportu!
      </p>
      <LoginForm />
    </div>
  );
}
