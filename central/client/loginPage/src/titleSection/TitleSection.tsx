import React from "react";

export default function TitleSection() {
  return (
    <>
      <div className="felx mb-4 h-32 w-32 items-center justify-center">
        <img
          className="block h-full w-full object-contain"
          src="/public/svgs/tableTopVaultIcon.svg"
          alt="The vault logo"
        />
      </div>
      <div className="title mb-8 font-Josefin text-4xl font-bold text-fg-red-light">
        The Vault
      </div>
    </>
  );
}
