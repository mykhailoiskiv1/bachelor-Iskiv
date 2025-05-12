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
      <main className="relative py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-light tracking-tight text-[var(--color-text-primary)] mb-4">
              Our Completed Projects
            </h1>
            <p className="text-md text-[var(--color-text-secondary)] max-w-2xl mx-auto leading-relaxed">
              A gallery of our best work — crafted with care, function, and detail.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {projects.map((p) => (
              <Link key={p.id} href={`/projects/${p.slug}`} className="group block relative">
                <div className="relative overflow-hidden rounded-2xl shadow-sm transition-transform duration-300 group-hover:-translate-y-1 group-hover:shadow-md">
                  <img
                    src={p.imagePaths?.[0] || '/placeholder.png'}
                    alt={p.title}
                    className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="absolute -bottom-6 left-6 bg-white/90 backdrop-blur-sm border border-[var(--color-border)] rounded-xl px-4 py-3 shadow-lg w-[85%]">
                  <h3 className="text-lg font-medium text-[var(--color-text-primary)] truncate">{p.title}</h3>
                  <p className="text-sm text-[var(--color-text-secondary)]">{p.category}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>

  );
}
