export type Certificate = {
  id: number;
  title: string;
  fileUrl: string;
  issuedDate: string;
  client: {
    email: string;
    name: string | null;
  };
};
