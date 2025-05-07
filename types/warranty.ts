export type Warranty = {
  id: number;
  projectName: string;
  startDate: string;
  durationMonths: number;
  client: {
    email: string;
    name: string | null;
  };
};
