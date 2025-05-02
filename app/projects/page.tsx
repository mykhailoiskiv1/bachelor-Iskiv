import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function AllProjectsPage() {
  const projects = await prisma.project.findMany({
    where: { deletedAt: null, published: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <main className="px-4 py-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">All Projects</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {projects.map(p => (
          <Link key={p.id} href={`/projects/${p.slug}`}>
            <div className="border rounded-lg overflow-hidden shadow hover:shadow-md">
              <img src={p.imagePaths?.[0] || '/placeholder.png'} alt={p.title} className="h-48 w-full object-cover" />
              <div className="p-4">
                <h3 className="text-lg font-semibold">{p.title}</h3>
                <p className="text-sm text-gray-500">{p.category}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}