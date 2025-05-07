'use client';

import useSWR from 'swr';
import Link from 'next/link';

type Project = {
  id: number;
  title: string;
  category: string;
  deletedAt: string;
};

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function ArchivedProjectsPage() {
  const { data: projects, mutate } = useSWR<Project[]>('/api/admin/projects/archived', fetcher);

  const handleRestore = async (id: number) => {
    const res = await fetch(`/api/admin/projects/${id}/restore`, { method: 'PATCH' });
    if (res.ok) {
      mutate();
    } else {
      alert('Failed to restore');
    }
  };

  if (!projects) return <p className="text-center">Loading...</p>;

  return (
    <main className="px-4 py-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Archived Projects</h1>
      {projects.length === 0 ? (
        <p>No archived projects.</p>
      ) : (
        <ul className="space-y-4">
          {projects.map(p => (
            <li key={p.id} className="p-4 border rounded flex justify-between items-center bg-gray-50">
              <div>
                <h2 className="text-lg font-semibold">{p.title}</h2>
                <p className="text-sm text-gray-500">{p.category}</p>
              </div>
              <button
                onClick={() => handleRestore(p.id)}
                className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
              >
                Restore
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-6">
        <Link href="/admin/projects">
          <button className="text-blue-600 underline">Back to project list</button>
        </Link>
      </div>
    </main>
  );
}
