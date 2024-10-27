"use client";

import { authenticate } from "../../../lib/actions";
import { useFormStatus } from "react-dom";
import { MouseEvent } from "react";

export default function LoginForm() {
  const [errorMessage, dispatch] = useActionState(authenticate, undefined);

  return (
    <form className="text-black" action={dispatch}>
      <input type="email" name="email" placeholder="Email" required />
      <input type="password" name="password" placeholder="Password" required />
      <div>{errorMessage && <p>{errorMessage}</p>}</div>
      <LoginButton />
    </form>
  );
}

function LoginButton() {
  const { pending } = useFormStatus();

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (pending) {
      event.preventDefault();
    }
  };

  return (
    <button className="text-white" aria-disabled={pending} type="submit" onClick={handleClick}>
      Login
    </button>
  );
}
