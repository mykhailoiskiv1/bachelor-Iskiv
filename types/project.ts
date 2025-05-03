export type Project = {
    id: number;
    title: string;
    slug: string;
    description: string;
    content: string;
    category: string;
    location?: string;
    completionDate?: string;
    seoTitle?: string;
    seoDescription?: string;
    seoKeywords?: string;
    published: boolean;
    imagePaths: string[];
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string | null;
  };
  