export type Notification = {
  id: number;
  title: string;
  message: string;
  createdAt: string;
  client: {
    email: string;
    name: string | null;
  };
};
