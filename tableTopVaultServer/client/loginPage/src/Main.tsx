import React from "react";
import TitleSection from "./titleSection/TitleSection";
import LoginForm from "./loginForm/LoginForm";

export default function Main() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-fg-tone-black-2 font-K2D text-fg-white">
      <TitleSection />

      <LoginForm />
    </div>
  );
}
