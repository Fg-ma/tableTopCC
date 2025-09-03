import React from "react";
import { PendingRequestType } from "../../serverRequests/lib/typeConstant";
import PrettyJSON from "../../prettyJSON/PrettyJSON";
import ServerRequests from "../../serverRequests/ServerRequests";

export default function RequestItem({
  request,
  serverRequestsRef,
}: {
  request: PendingRequestType;
  serverRequestsRef: React.RefObject<ServerRequests>;
}) {
  return (
    <li className="flex w-full flex-col justify-between rounded-2xl bg-fg-tone-black-3 p-4 shadow-fg-tone-black-1 transition-all hover:-translate-y-1 hover:shadow-2xl">
      <div className="mb-3 cursor-default font-Josefin font-bold text-fg-red-light">
        {request.request_id}
      </div>
      <PrettyJSON data={request} />
      <div className="flex justify-end gap-2">
        <button
          className="rounded-lg border-2 border-fg-red bg-fg-red-light px-4 py-2 font-K2D text-base text-fg-white hover:border-fg-red-dark hover:bg-fg-red"
          onClick={() =>
            serverRequestsRef.current.sendAccept(request.request_id)
          }
        >
          Accept
        </button>
        <button
          className="rounded-lg border-2 border-fg-tone-black-7 bg-fg-tone-black-6 px-4 py-2 font-K2D text-base text-fg-white hover:border-fg-tone-black-6 hover:bg-fg-tone-black-5"
          onClick={() =>
            serverRequestsRef.current.sendDecline(request.request_id)
          }
        >
          Decline
        </button>
      </div>
    </li>
  );
}
