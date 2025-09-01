import { useRef } from "react";
import NavigationPanel from "./navigationPanel/NavigationPanel";
import VaultRequestsPanel from "./vaultRequestsPanel/VaultRequestsPanel";
import ServerRequests from "./ServerRequests";
import "./css/scrollbar.css";

export default function Main() {
  const requestListRef = useRef<HTMLUListElement>(null);
  const serverRequestsRef = useRef<ServerRequests>(
    new ServerRequests(requestListRef),
  );

  return (
    <div className="flex h-full w-full">
      <NavigationPanel serverRequestsRef={serverRequestsRef} />

      <VaultRequestsPanel
        serverRequestsRef={serverRequestsRef}
        requestListRef={requestListRef}
      />
    </div>
  );
}
