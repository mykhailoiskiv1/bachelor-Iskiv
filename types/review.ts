export type Review = {
    id: number;
    clientName: string;
    rating: number;
    content: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    companyReply?: string;
    createdAt: string;
  };
  