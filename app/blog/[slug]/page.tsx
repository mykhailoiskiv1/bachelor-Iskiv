import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { getSignedUrl } from '@/lib/gcs/getSignedUrl';

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;

  const post = await prisma.post.findUnique({
    where: { slug },
  });

  if (!post) return notFound();

  const signedUrl = await getSignedUrl(post.imagePath);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      <p className="text-sm text-gray-500 mb-6">
        {post.category} | {new Date(post.createdAt).toLocaleDateString()}
      </p>
      <img
        src={signedUrl}
        alt={post.title}
        className="w-full h-64 object-cover rounded mb-6"
      />
      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </div>
  );
}
