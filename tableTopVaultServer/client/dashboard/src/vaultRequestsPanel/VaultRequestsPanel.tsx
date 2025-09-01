import React, { useEffect, useRef } from "react";
import ServerRequests from "../ServerRequests";

export default function VaultRequestsPanel({
  serverRequestsRef,
}: {
  serverRequestsRef: React.RefObject<ServerRequests>;
}) {
  const requestsIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    window.addEventListener("load", serverRequestsRef.current.loadRequests);
    requestsIntervalRef.current = setInterval(
      serverRequestsRef.current.loadRequests,
      5000
    );

    return () => {
      window.removeEventListener(
        "load",
        serverRequestsRef.current.loadRequests
      );
      if (requestsIntervalRef.current) {
        clearInterval(requestsIntervalRef.current);
        requestsIntervalRef.current = null;
      }
    };
  }, []);

  return (
    <div className='flex flex-col items-center justify-center h-full bg-blue-400 text-fg-off-white grow overflow-hidden'>
      <main className='w-full h-full m-0 items-center justify-center flex-1 flex'>
        <section
          id='requestsContainer'
          className='card small-vertical-scroll-bar'
        >
          <div className='flex items-center'>
            <h2>Pending Requests</h2>
            <button className='accept-all-btn' id='acceptAllBtn'>
              Accept all
            </button>
          </div>
          <ul id='requestsList' className='requests-list'></ul>
        </section>
      </main>
    </div>
  );
}
