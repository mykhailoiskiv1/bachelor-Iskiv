import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/FooterMinimal';

export default async function AllProjectsPage() {
  const projects = await prisma.project.findMany({
    where: { deletedAt: null, published: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <>
      <Header />
      <main className="px-4 py-8 max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-10 text-center text-textPrimary">Our Completed Projects</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p) => (
            <Link
              key={p.id}
              href={`/projects/${p.slug}`}
              className="group relative block overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-shadow"
            >
              <div className="h-72">
                <img
                  src={p.imagePaths?.[0] || '/placeholder.png'}
                  alt={p.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="absolute bottom-0 left-0 w-full bg-black/50 text-white px-4 py-3 backdrop-blur-sm transition-all duration-300 group-hover:bg-black/60">
                <h3 className="text-xl font-semibold">{p.title}</h3>
                <p className="text-sm text-gray-300">{p.category}</p>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
