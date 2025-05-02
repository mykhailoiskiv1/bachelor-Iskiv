'use client';

import useSWR from 'swr';
import Link from 'next/link';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function ProjectPreview() {
  const { data: projects } = useSWR('/api/public/projects/preview', fetcher);

  if (!projects) return null;

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold mb-4">Our Recent Projects</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {projects.map((p: { id: string; slug: string; imagePaths?: string[]; title: string; category: string }) => (
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
      <div className="mt-4">
        <Link
          href="/projects"
          className="inline-block mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          View All Projects
        </Link>
      </div>
    </section>
  );
}


