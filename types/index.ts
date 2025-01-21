export type ResidentStatus = "ACTIVE" | "INACTIVE";

export type Resident = {
  id: string;
  name: string;
  roomNumber: number;
  status: ResidentStatus;
  createdAt?: string;
};
