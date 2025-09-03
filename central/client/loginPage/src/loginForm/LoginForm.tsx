import React, { useRef } from "react";

export default function LoginForm() {
  const vaultPasswordInputRef = useRef<HTMLInputElement>(null);
  const toggleVisibilityButtonRef = useRef<HTMLImageElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!vaultPasswordInputRef.current) return;

    const res = await fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cmd: "login",
        password: vaultPasswordInputRef.current.value,
      }),
      credentials: "include",
    });

    vaultPasswordInputRef.current.value = "";

    if (res.ok) {
      window.location.href = "/dashboard/";
    } else {
      const loginError = document.getElementById("loginError");
      if (loginError) loginError.textContent = "Invalid password";
    }
  };

  const toggleVisibility = () => {
    if (!vaultPasswordInputRef.current || !toggleVisibilityButtonRef.current)
      return;
    const isHidden = vaultPasswordInputRef.current.type === "password";
    vaultPasswordInputRef.current.type = isHidden ? "text" : "password";
    toggleVisibilityButtonRef.current.src = isHidden
      ? "/public/svgs/visibilityOffIcon.svg"
      : "/public/svgs/visibilityIcon.svg";
    toggleVisibilityButtonRef.current.alt = isHidden
      ? "Hide password"
      : "Show password";
  };

  return (
    <form
      className="flex w-[90%] max-w-[456px] flex-col items-center gap-4"
      autoComplete="off"
      onSubmit={handleSubmit}
    >
      <div className="relative flex w-full flex-col items-start">
        <label htmlFor="vaultPassword" className="mb-1 font-semibold">
          Vault password
        </label>
        <div className="flex h-max w-full items-center justify-between overflow-hidden rounded-md border border-fg-tone-black-6 bg-fg-tone-black-4 focus-within:border-2 focus-within:border-fg-off-white">
          <input
            id="vaultPassword"
            ref={vaultPasswordInputRef}
            type="password"
            placeholder="xxxxxx"
            required
            name="password"
            autoComplete="new-password"
            className="w-full border-none bg-transparent p-3 text-base text-fg-white outline-none"
          />
          <button
            id="toggle-password-visibility"
            type="button"
            className="mr-2 aspect-square h-[90%] cursor-pointer border-none bg-transparent p-0 text-base text-fg-off-white"
            aria-label="Toggle password visibility"
            onClick={toggleVisibility}
          >
            <img
              ref={toggleVisibilityButtonRef}
              src="/public/svgs/visibilityIcon.svg"
              className="block h-full w-full object-contain"
              alt="Show password"
            />
          </button>
        </div>
      </div>
      <button
        type="submit"
        className="cursor-pointer rounded-md border-none bg-fg-red px-8 py-3 text-base font-bold text-fg-white transition-colors hover:bg-fg-red-dark"
      >
        Login
      </button>
      <p
        id="loginError"
        className="mt-2 min-h-4 text-center text-base text-fg-red-light"
      ></p>
    </form>
  );
}
