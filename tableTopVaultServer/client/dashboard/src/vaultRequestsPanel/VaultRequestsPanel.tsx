import React, { useEffect, useRef } from "react";
import ServerRequests from "../ServerRequests";

export default function VaultRequestsPanel({
  requestListRef,
  serverRequestsRef,
}: {
  requestListRef: React.RefObject<HTMLUListElement | null>;
  serverRequestsRef: React.RefObject<ServerRequests>;
}) {
  const requestsIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    window.addEventListener("load", serverRequestsRef.current.loadRequests);
    requestsIntervalRef.current = setInterval(
      serverRequestsRef.current.loadRequests,
      5000,
    );

    return () => {
      window.removeEventListener(
        "load",
        serverRequestsRef.current.loadRequests,
      );
      if (requestsIntervalRef.current) {
        clearInterval(requestsIntervalRef.current);
        requestsIntervalRef.current = null;
      }
    };
  }, []);

  return (
    <div className="flex h-full grow flex-col items-center justify-center overflow-hidden bg-fg-tone-black-1 text-fg-off-white">
      <main className="mx-0 my-0 flex h-full w-full flex-1 items-center justify-center">
        <section className="card small-vertical-scroll-bar h-[90%] w-[90%] overflow-y-auto">
          <div className="flex items-center">
            <h2>Pending Requests</h2>
            <button className="accept-all-btn">Accept all</button>
          </div>
          <ul ref={requestListRef} className="grid list-none gap-4"></ul>
        </section>
      </main>
    </div>
  );
}
