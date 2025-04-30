export type Client = {
    id: string;
    name: string | null;
    email: string;
    address: string;
    isConfirmed?: boolean;
    isActive?: boolean;
  };
  