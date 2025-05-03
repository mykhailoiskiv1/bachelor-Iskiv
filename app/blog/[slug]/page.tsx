import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Header from '@/components/layout/Header';
import FooterMinimal from '@/components/layout/FooterMinimal';

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;

  const post = await prisma.post.findUnique({
    where: { slug },
  });

  if (!post) return notFound();

  return (
    <>
      <Header />
      <article className="bg-[var(--color-background)] min-h-screen px-4 sm:px-8 md:px-12 lg:px-20 xl:px-32 py-20">
        <div className="max-w-3xl mx-auto space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <span className="text-xs font-semibold uppercase text-[var(--color-accent)] tracking-wider">
              {post.category}
            </span>
            <span className="text-sm text-[var(--color-text-secondary)]">
              {new Date(post.createdAt).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </span>
          </div>

          <h1 className="text-4xl font-bold text-[var(--color-text-primary)] leading-tight">
            {post.title}
          </h1>

          <div className="overflow-hidden rounded-2xl shadow-md">
            <img
              src={post.imagePath}
              alt={post.title}
              className="w-full h-auto object-cover"
            />
          </div>

          <div
            className="prose prose-lg max-w-none text-[var(--color-text-primary)] prose-headings:font-semibold prose-p:leading-relaxed prose-img:rounded-lg prose-a:text-[var(--color-accent)] prose-a:no-underline hover:prose-a:underline"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </article>
      <FooterMinimal />
    </>
  );
}
