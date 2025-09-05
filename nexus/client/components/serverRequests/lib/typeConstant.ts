export type PendingRequestType = {
  id: string;
  ip: string;
  num_uses: number;
  policies: string[];
  purpose: string;
  request_id: string;
};
