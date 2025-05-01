'use client';

import useSWR from 'swr';
import Link from 'next/link';
import type { Project } from '@/types/project';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function AdminProjectList() {
  const { data: projects, mutate } = useSWR<Project[]>('/api/admin/projects', fetcher);

  const handleSoftDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    const res = await fetch(`/api/admin/projects/${id}`, { method: 'DELETE' });
    if (res.ok) mutate();
    else alert('Failed to delete');
  };

  if (!projects) return <p className="text-center">Loading...</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Projects</h1>
        <Link href="/admin/projects/create">
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            + New Project
          </button>
        </Link>
      </div>

      <ul className="space-y-4">
        {projects.map((project) => (
          <li
            key={project.id}
            className="p-4 border rounded-lg flex justify-between items-center bg-white shadow-sm"
          >
            <div className="flex items-center gap-4">
              <img
                src={project.imagePaths?.[0] || '/placeholder.png'}
                alt={project.title}
                className="w-20 h-20 object-cover rounded"
              />
              <div>
                <h2 className="text-lg font-semibold">{project.title}</h2>
                <p className="text-sm text-gray-500">{project.category}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Link href={`/admin/projects/${project.id}/edit`}>
                <button className="px-3 py-1 border rounded hover:bg-gray-100">Edit</button>
              </Link>
              <button
                onClick={() => handleSoftDelete(project.id)}
                className="px-3 py-1 text-red-600 border border-red-600 rounded hover:bg-red-100"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
