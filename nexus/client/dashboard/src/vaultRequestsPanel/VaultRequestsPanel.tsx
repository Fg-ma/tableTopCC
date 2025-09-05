import React, { useEffect, useRef, useState } from "react";
import ServerRequests from "../../../components/serverRequests/ServerRequests";
import { PendingRequestType } from "../../../components/serverRequests/lib/typeConstant";
import SortRequestsDrop from "./lib/SortRequestsDrop";
import RequestItem from "./lib/RequestItem";
import { sortRequestsMap, SortRequestsTypes } from "./lib/typeConstant";

export default function VaultRequestsPanel({
  serverRequestsRef,
  pendingRequests,
}: {
  serverRequestsRef: React.RefObject<ServerRequests>;
  pendingRequests: React.RefObject<PendingRequestType[]>;
}) {
  const requestsIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [sort, setSort] = useState<null | SortRequestsTypes>(null);
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

  const acceptAll = () => {
    for (const req of pendingRequests.current) {
      serverRequestsRef.current.sendAccept(req.request_id);
    }
  };

  const declineAll = () => {
    for (const req of pendingRequests.current) {
      serverRequestsRef.current.sendDecline(req.request_id);
    }
  };

  const groupBy = <T, K extends keyof T>(arr: T[], key: K): T[][] => {
    const groups: Record<string, T[]> = {};

    arr.forEach((item) => {
      const field = String(item[key]);
      if (!groups[field]) {
        groups[field] = [];
      }
      groups[field].push(item);
    });

    const groupedArray = Object.values(groups).sort((a, b) => {
      const keyA = String(a[0][key]);
      const keyB = String(b[0][key]);
      return keyA.localeCompare(keyB, undefined, { numeric: true });
    });

    return groupedArray;
  };

  return (
    <div className="flex h-full grow flex-col items-center justify-center overflow-hidden bg-fg-tone-black-1 text-fg-off-white">
      <main className="mx-0 my-0 flex h-full w-full flex-1 items-center justify-center">
        <section
          className="small-vertical-scroll-bar h-[90%] w-[90%] overflow-y-auto rounded-2xl border-2 border-fg-tone-black-7 bg-fg-tone-black-4 p-6"
          style={{ boxShadow: "0 4px 12px rgba(0, 0, 0, 0.6)" }}
        >
          <div className="mb-6 flex items-center justify-between space-x-2">
            <h1 className="text-xl font-bold">Pending Requests</h1>
            <div className="small-horizontal-scroll-bar flex items-center justify-start space-x-4">
              <SortRequestsDrop sort={sort} setSort={setSort} />
              <button
                className="w-28 min-w-28 rounded-lg border-2 border-fg-red bg-fg-red-light px-4 py-2 font-K2D text-base text-fg-white hover:border-fg-red-dark hover:bg-fg-red"
                onClick={acceptAll}
              >
                Accept all
              </button>
              <button
                className="w-[120px] min-w-[120px] rounded-lg border-2 border-fg-tone-black-7 bg-fg-tone-black-6 px-4 py-2 font-K2D text-base text-fg-white hover:border-fg-tone-black-6 hover:bg-fg-tone-black-5"
                onClick={declineAll}
              >
                Decline all
              </button>
            </div>
          </div>
          <ul className="w-full list-none space-y-6">
            {!sort
              ? pendingRequests.current.map((req) => (
                  <RequestItem
                    key={req.request_id}
                    request={req}
                    serverRequestsRef={serverRequestsRef}
                  />
                ))
              : groupBy(
                  pendingRequests.current ?? [],
                  sortRequestsMap[sort] as keyof PendingRequestType,
                ).map((group) => (
                  <div className="flex flex-col items-center justify-center space-y-6">
                    <div className="flex w-full flex-col space-y-1">
                      <div className="flex items-center justify-between space-x-2">
                        <div className="ml-4 font-Josefin text-lg">
                          {
                            group[0][
                              sortRequestsMap[sort] as keyof PendingRequestType
                            ]
                          }
                        </div>
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            className="rounded-lg border-2 border-fg-red bg-fg-red-light px-4 py-1 font-K2D text-sm text-fg-white hover:border-fg-red-dark hover:bg-fg-red"
                            onClick={() => {
                              for (const req of group) {
                                serverRequestsRef.current.sendAccept(
                                  req.request_id,
                                );
                              }
                            }}
                          >
                            Accept all
                          </button>
                          <button
                            className="rounded-lg border-2 border-fg-tone-black-7 bg-fg-tone-black-6 px-4 py-1 font-K2D text-sm text-fg-white hover:border-fg-tone-black-6 hover:bg-fg-tone-black-5"
                            onClick={() => {
                              for (const req of group) {
                                serverRequestsRef.current.sendDecline(
                                  req.request_id,
                                );
                              }
                            }}
                          >
                            Decline all
                          </button>
                        </div>
                      </div>

                      <div className="h-0.5 w-full rounded-full bg-fg-red" />
                    </div>
                    {group.map((req) => (
                      <div className="w-[96%]">
                        <RequestItem
                          key={req.request_id}
                          request={req}
                          serverRequestsRef={serverRequestsRef}
                        />
                      </div>
                    ))}
                  </div>
                ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
