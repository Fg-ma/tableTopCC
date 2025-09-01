import { useRef } from "react";
import NavigationPanel from "./navigationPanel/NavigationPanel";
import VaultRequestsPanel from "./vaultRequestsPanel/VaultRequestsPanel";
import ServerRequests from "./ServerRequests";
import "./css/scrollbar.css";

export default function Main() {
  const serverRequestsRef = useRef<ServerRequests>(new ServerRequests());

  return (
    <div className='flex w-full h-full'>
      <NavigationPanel serverRequestsRef={serverRequestsRef} />

      <VaultRequestsPanel serverRequestsRef={serverRequestsRef} />
    </div>
  );
}
