export type Service = {
  id: number;
  title: string;
  category: string;
  description?: string;
  icon: string;
  isFeatured: boolean;
  sortOrder: number;
  isHot: boolean;
  createdAt: string;
};
