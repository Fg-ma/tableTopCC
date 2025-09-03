import { PendingRequestType } from "./lib/typeConstant";

export default class ServerRequests {
  constructor(private pendingRequests: React.RefObject<PendingRequestType[]>) {}

  loadRequests = async () => {
    try {
      const res = await fetch("/list", {
        credentials: "include",
      });

      if (res.status === 401) {
        window.location.href = "/loginPage/";
        return;
      }

      if (!res.ok) throw new Error("Failed to fetch");

      const data = (await res.json()) as (PendingRequestType & {
        cmd: string;
      })[];

      this.pendingRequests.current = data.map(({ cmd, ...rest }) => rest);
    } catch (e) {
      console.error(e);
    }
  };

  sendAccept = async (requestId: string) => {
    try {
      const res = await fetch("/approve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ cmd: "approve", request_id: requestId }),
      });
      if (res.ok) {
        setTimeout(() => this.loadRequests(), 500);
      } else console.error("Approve failed");
    } catch (e) {
      console.error(e);
    }
  };

  sendDecline = async (requestId: string) => {
    try {
      const res = await fetch("/decline", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ cmd: "decline", request_id: requestId }),
      });
      if (res.ok) {
        setTimeout(() => this.loadRequests(), 500);
      } else console.error("Decline failed");
    } catch (e) {
      console.error(e);
    }
  };

  sendLogout = async () => {
    try {
      await fetch("/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      window.location.href = "/loginPage/";
    } catch (e) {
      console.error(e);
    }
  };
}
