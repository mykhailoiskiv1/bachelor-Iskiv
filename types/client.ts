export type Client = {
  id: string;
  name: string | null;
  email: string;
  address: string;
  isConfirmed?: boolean;
  isActive?: boolean;
};

export type ClientProjectWithClient = {
  id: number
  name: string
  status: string
  startDate: string
  endDate: string | null
  createdAt: string
  updatedAt: string
  client: {
    name: string | null
    email: string
  }
}
