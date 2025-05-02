'use client';

import useSWR from 'swr';
import Link from 'next/link';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function ProjectPreview() {
  const { data: projects } = useSWR('/api/public/projects/preview', fetcher);

  if (!projects) return null;

  return (
    <section className="relative py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-light tracking-tight text-[var(--color-text-primary)] mb-4">
            Our Recent Projects
          </h2>
          <p className="text-md text-[var(--color-text-secondary)] max-w-2xl mx-auto leading-relaxed">
            A glimpse into our latest renovations and builds — minimal design, maximum function.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {projects.map(
            (p: {
              id: string;
              slug: string;
              imagePaths?: string[];
              title: string;
              category: string;
            }) => (
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
            )
          )}
        </div>

        <div className="text-center mt-20">
          <Link
            href="/projects"
            className="inline-block text-sm font-medium text-[var(--color-accent)] hover:underline underline-offset-4"
          >
            View All Projects →
          </Link>
        </div>
      </div>
    </section>
  );
}
