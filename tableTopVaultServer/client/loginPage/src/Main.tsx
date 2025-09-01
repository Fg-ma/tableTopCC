import React, { useRef } from "react";

export default function Main() {
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
    <div className='flex flex-col items-center justify-center w-full h-full'>
      <div className='logo'>
        <img src='/public/svgs/tableTopVaultIcon.svg' alt='The vault logo' />
      </div>
      <div className='title'>The Vault</div>

      <form id='loginForm' autoComplete='off' onSubmit={handleSubmit}>
        <div className='login-field'>
          <label htmlFor='vaultPassword'>Vault password</label>
          <div className='vault-input'>
            <input
              id='vaultPassword'
              ref={vaultPasswordInputRef}
              type='password'
              placeholder='xxxxxx'
              required
              name='password'
              autoComplete='new-password'
            />
            <button
              id='toggle-password-visibility'
              type='button'
              className='toggle-visibility'
              aria-label='Toggle password visibility'
              onClick={toggleVisibility}
            >
              <img
                ref={toggleVisibilityButtonRef}
                src='/public/svgs/visibilityIcon.svg'
                alt='Show password'
              />
            </button>
          </div>
        </div>
        <button type='submit' className='btn'>
          Login
        </button>
        <p id='loginError' className='error-msg'></p>
      </form>
    </div>
  );
}
