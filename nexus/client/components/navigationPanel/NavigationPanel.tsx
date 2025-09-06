import React, { useRef } from "react";
import ServerRequests from "../serverRequests/ServerRequests";

export default function NavigationPanel({
  serverRequestsRef,
}: {
  serverRequestsRef: React.RefObject<ServerRequests>;
}) {
  const navigationPanelRef = useRef<HTMLElement>(null);

  const toggleNavigationPanel = () => {
    navigationPanelRef.current?.classList.toggle("collapsed");
  };

  const handleLogout = () => {
    serverRequestsRef.current.sendLogout();
  };

  return (
    <aside
      ref={navigationPanelRef}
      className="navigation-panel relative flex h-full flex-col justify-start bg-fg-white p-4 text-fg-tone-black-1 transition-transform"
    >
      <button
        className="navigation-panel-toggle-tab absolute left-full top-4 h-10 w-8 cursor-pointer rounded-r-lg border-none bg-fg-white text-3xl text-fg-tone-black-1"
        onClick={toggleNavigationPanel}
      >
        <img
          className="h-6 w-6 object-contain"
          src="/public/svgs/navigateForward.svg"
          alt="Open side bar"
        />
      </button>
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center justify-center space-x-2">
          <div className="aspect-square h-10">
            <img
              className="h-full w-full object-contain"
              src="/public/svgs/tableTopNexusIcon.svg"
              alt="The nexus logo"
            />
          </div>
          <h1 className="navigation-panel-title mt-1 font-Josefin text-2xl">
            Nexus
          </h1>
        </div>
        <button
          className="navigation-panel-toggle aspect-square h-5 cursor-pointer border-none bg-transparent text-fg-tone-black-1"
          onClick={toggleNavigationPanel}
        >
          <img
            className="h-full w-full object-contain"
            src="/public/svgs/closeIcon.svg"
            alt="Close side bar"
          />
        </button>
      </div>
      <nav className="navigation-panel-nav">
        <ul>
          <li>
            <a href="/dashboard/">Dashboard</a>
          </li>
          <li>
            <a href="/vault/">Vault</a>
          </li>
          <li>
            <a href="/mongo/">Mongo</a>
          </li>
        </ul>
      </nav>
      <button
        className="logout-btn cursor-pointer rounded-lg border-none bg-fg-red px-4 py-3 font-K2D text-base text-fg-white transition-colors hover:bg-fg-red-dark"
        onClick={handleLogout}
      >
        Logout
      </button>
    </aside>
  );
}
