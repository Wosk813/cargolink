import { SignupForm } from "@/src/app/ui/auth/signup-form";

export default function Page() {
  return (
    <div className="md:bg-slate-800 h-full px-12 py-8 w-full md:w-4/12 md:justify-center flex flex-col gap-6">
      <h1 className="text-5xl font-bold md:text-center">Dołącz do nas</h1>
      <SignupForm />
    </div>
  );
}
