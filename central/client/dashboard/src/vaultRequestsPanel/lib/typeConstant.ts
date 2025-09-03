export type SortRequestsTypes = "Host" | "ip" | "Purpose" | "Uses" | "Policies";

export const sortRequestsOptions = [
  "Host",
  "ip",
  "Purpose",
  "Uses",
  "Policies",
];

export const sortRequestsMap: {
  [sortRequestsType in SortRequestsTypes]: string;
} = {
  Host: "id",
  ip: "ip",
  Purpose: "purpose",
  Uses: "num_uses",
  Policies: "policies",
};
