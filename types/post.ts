export type Post = {
    id: string;
    title: string;
    slug: string;
    category: string;
    content: string;
    imagePath: string;
    seoTitle?: string;
    seoDescription?: string;
    seoKeywords?: string;
    published: boolean;
    createdAt: string;
    updatedAt: string;
};

export type CreatePostPayload = {
    title: string;
    category: string;
    content: string;
    imagePath: string;
};

export type UpdatePostPayload = CreatePostPayload & {
    seoTitle?: string;
    seoDescription?: string;
    seoKeywords?: string;
};
