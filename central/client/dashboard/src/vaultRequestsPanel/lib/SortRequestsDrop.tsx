import { useEffect, useRef, useState } from "react";
import { sortRequestsOptions, SortRequestsTypes } from "./typeConstant";

export default function SortRequestsDrop({
  sort,
  setSort,
}: {
  sort: null | SortRequestsTypes;
  setSort: React.Dispatch<React.SetStateAction<null | SortRequestsTypes>>;
}) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleClose = (event: MouseEvent) => {
      if (
        !buttonRef.current?.contains(event.target as Node) &&
        !dropRef.current?.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    window.addEventListener("click", handleClose);

    return () => {
      window.removeEventListener("click", handleClose);
    };
  }, [open]);

  return (
    <div className="relative w-64 min-w-64">
      {/* Button */}
      <button
        ref={buttonRef}
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between rounded-2xl border-2 border-fg-tone-black-6 bg-fg-tone-black-2 px-4 py-2 text-fg-white shadow-md transition hover:border-fg-tone-black-7 hover:bg-fg-tone-black-3"
      >
        <span>{sort ?? "Select a filter"}</span>
        <img
          className={`h-6 w-6 rotate-90 object-contain ${open ? "-scale-x-100" : ""} transition-transform`}
          src="/public/svgs/navigateForwardWhite.svg"
          alt={open ? "Close filter drop" : "Open filter drop"}
        />
      </button>

      {/* Dropdown list */}
      {open && (
        <ul
          ref={dropRef}
          className="small-vertical-scroll-bar absolute z-10 mt-1 max-h-64 w-full overflow-y-auto rounded-2xl border border-[#313131] bg-[#212121] shadow-lg"
        >
          <li
            onClick={() => {
              setSort(null);
              setOpen(false);
            }}
            className="cursor-pointer px-4 py-2 text-[#f2f2f2] transition hover:bg-[#313131] hover:text-[#d6d6d6]"
          >
            None
          </li>
          {sortRequestsOptions.map((opt) => (
            <li
              key={opt}
              onClick={() => {
                setSort(opt as SortRequestsTypes);
                setOpen(false);
              }}
              className="cursor-pointer px-4 py-2 text-[#f2f2f2] transition hover:bg-[#313131] hover:text-[#d6d6d6]"
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
