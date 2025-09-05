import { useRef } from "react";
import NavigationPanel from "../../components/navigationPanel/NavigationPanel";
import VaultRequestsPanel from "./vaultRequestsPanel/VaultRequestsPanel";
import ServerRequests from "../../components/serverRequests/ServerRequests";
import { PendingRequestType } from "../../components/serverRequests/lib/typeConstant";
import "./css/scrollbar.css";

export default function Main() {
  const pendingRequests = useRef<PendingRequestType[]>([]);
  const serverRequestsRef = useRef<ServerRequests>(
    new ServerRequests(pendingRequests),
  );

  return (
    <div className="flex h-full w-full">
      <NavigationPanel serverRequestsRef={serverRequestsRef} />

      <VaultRequestsPanel
        serverRequestsRef={serverRequestsRef}
        pendingRequests={pendingRequests}
      />
    </div>
  );
}
