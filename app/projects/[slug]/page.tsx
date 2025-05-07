import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/FooterMinimal';

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function PublicProjectPage({ params }: Props) {
  const { slug } = await params;

  const project = await prisma.project.findUnique({
    where: { slug },
  });

  if (!project) return notFound();

  const { title, category, createdAt, content, imagePaths = [] } = project;

  return (
    <>
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-4xl font-bold mb-3 text-textPrimary">{title}</h1>
        <p className="text-sm text-gray-500 mb-6">
          {category} | {new Date(createdAt).toLocaleDateString()}
        </p>

        {imagePaths.length > 0 ? (
          <div className="mb-8">
            <img
              src={imagePaths[0]}
              alt={title}
              className="w-full h-[400px] object-cover rounded-2xl shadow"
            />
          </div>
        ) : (
          <div className="h-[400px] bg-gray-200 flex items-center justify-center rounded-2xl mb-8 text-gray-500">
            No image available
          </div>
        )}

        <div className="prose max-w-none mb-10 text-textPrimary">
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </div>

        {imagePaths.length > 1 && (
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-textPrimary">More photos</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {imagePaths.slice(1).map((path, index) => (
                <img
                  key={index}
                  src={path}
                  alt={`${title} - photo ${index + 2}`}
                  className="w-full h-48 object-cover rounded-lg shadow-sm hover:shadow-md transition-shadow"
                />
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
