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
      className="navigation-panel relative flex h-full w-60 flex-col justify-start bg-fg-white p-4 text-fg-tone-black-1 transition-transform"
    >
      <button
        className="navigation-panel-toggle-tab absolute left-full top-4 hidden h-10 w-8 cursor-pointer rounded-r-lg border-none bg-fg-white text-3xl text-fg-tone-black-1"
        onClick={toggleNavigationPanel}
      >
        <img
          className="block h-6 w-6 object-contain"
          src="/public/svgs/navigateForward.svg"
          alt="Open side bar"
        />
      </button>
      <div className="mb-8 flex items-center justify-between">
        <div className="h-10 w-10">
          <img
            className="block h-full w-full object-contain"
            src="/public/svgs/tableTopVaultIcon.svg"
            alt="The vault logo"
          />
        </div>
        <h1 className="navigation-panel-title mt-1 font-Josefin">The Vault</h1>
        <button
          className="navigation-panel-toggle h-5 w-5 cursor-pointer border-none bg-transparent text-fg-tone-black-1"
          onClick={toggleNavigationPanel}
        >
          <img
            className="block h-full w-full object-contain"
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
        </ul>
      </nav>
      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </aside>
  );
}
