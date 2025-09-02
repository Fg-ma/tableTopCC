import React, { useEffect, useRef, useState } from "react";
import ServerRequests from "../serverRequests/ServerRequests";
import { PendingRequestType } from "../serverRequests/lib/typeConstant";
import PrettyJSON from "../prettyJSON/PrettyJSON";

export default function VaultRequestsPanel({
  serverRequestsRef,
  pendingRequests,
}: {
  serverRequestsRef: React.RefObject<ServerRequests>;
  pendingRequests: React.RefObject<PendingRequestType[]>;
}) {
  const requestsIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [_, setRerender] = useState(false);

  const loadRequests = async () => {
    await serverRequestsRef.current.loadRequests();
    setRerender((prev) => !prev);
  };

  useEffect(() => {
    loadRequests();
    setTimeout(() => {
      setRerender((prev) => !prev);
    }, 50);

    window.addEventListener("load", serverRequestsRef.current.loadRequests);
    requestsIntervalRef.current = setInterval(loadRequests, 5000);

    return () => {
      window.removeEventListener("load", loadRequests);
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
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-xl font-bold">Pending Requests</h1>
            <button className="rounded-lg border-2 border-fg-red bg-fg-red-light px-4 py-2 font-K2D text-base text-fg-white">
              Accept all
            </button>
          </div>
          <ul className="w-full list-none space-y-6">
            {pendingRequests.current.map((req) => (
              <li
                key={req.request_id}
                className="flex w-full flex-col justify-between rounded-2xl bg-fg-tone-black-3 p-4 shadow-fg-tone-black-1 transition-all hover:-translate-y-1 hover:shadow-2xl"
              >
                <div className="mb-3 cursor-default font-Josefin font-bold text-fg-red-light">
                  {req.request_id}
                </div>
                <PrettyJSON data={req} />
                <div className="flex justify-end gap-2">
                  <button
                    className="accept-btn"
                    onClick={() =>
                      serverRequestsRef.current.sendAccept(req.request_id)
                    }
                  >
                    Accept
                  </button>
                  <button
                    className="decline-btn"
                    onClick={() =>
                      serverRequestsRef.current.sendDecline(req.request_id)
                    }
                  >
                    Decline
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
