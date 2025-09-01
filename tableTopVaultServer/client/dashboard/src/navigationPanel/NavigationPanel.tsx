import React, { useRef } from "react";
import ServerRequests from "../ServerRequests";

export default function NavigationPanel({
  serverRequestsRef,
}: {
  serverRequestsRef: React.RefObject<ServerRequests>;
}) {
  const navigationPanelRef = useRef<HTMLElement>(null);

  const toggleSideBar = () => {
    navigationPanelRef.current?.classList.toggle("collapsed");
  };

  const handleLogout = () => {
    serverRequestsRef.current.sendLogout();
  };

  return (
    <aside ref={navigationPanelRef} className='sidebar'>
      <button className='sidebar-toggle-tab' onClick={toggleSideBar}>
        <img src='/public/svgs/navigateForward.svg' alt='Open side bar' />
      </button>
      <div className='sidebar-header'>
        <div className='logo'>
          <img src='/public/svgs/tableTopVaultIcon.svg' alt='The vault logo' />
        </div>
        <h2 className='sidebar-title'>The Vault</h2>
        <button className='sidebar-toggle' onClick={toggleSideBar}>
          <img src='/public/svgs/closeIcon.svg' alt='Close side bar' />
        </button>
      </div>
      <nav className='sidebar-nav'>
        <ul>
          <li>
            <a href='/dashboard/'>Dashboard</a>
          </li>
        </ul>
      </nav>
      <button className='logout-btn' onClick={handleLogout}>
        Logout
      </button>
    </aside>
  );
}
