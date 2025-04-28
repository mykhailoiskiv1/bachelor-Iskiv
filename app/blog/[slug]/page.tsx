import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { getSignedUrl } from '@/lib/getSignedUrl';

export default async function BlogPostPage({ params }: { readonly params: { readonly slug: string } }) {
  if (!params.slug) return notFound();

  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
  });

  if (!post) return notFound();

  const signedUrl = await getSignedUrl(post.imagePath);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      <p className="text-sm text-gray-500 mb-6">{post.category} | {new Date(post.createdAt).toLocaleDateString()}</p>
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

