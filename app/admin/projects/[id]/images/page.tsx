"use client";

import { useState } from 'react';
import { useParams } from 'next/navigation';
import useSWR from 'swr';
import type { Project } from '@/types/project';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function ProjectImageManager() {
  const { id } = useParams();
  const [files, setFiles] = useState<File[]>([]);
  const { data: project, mutate } = useSWR<Project>(`/api/admin/projects/${id}`, fetcher);

  const handleUpload = async () => {
    if (!files.length) return alert('Please select images');
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));

    const res = await fetch(`/api/admin/projects/${id}/images`, {
      method: 'POST',
      body: formData,
    });

    if (res.ok) {
      alert('Images uploaded');
      setFiles([]);
      mutate();
    } else {
      const err = await res.json();
      alert(err.error ?? 'Upload failed');
    }
  };

  if (!project) return <p className="text-center">Loading...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Manage Project Images</h1>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={e => setFiles(Array.from(e.target.files || []))}
        className="mb-4"
      />
      <button
        onClick={handleUpload}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Upload Selected
      </button>

      <h2 className="text-lg font-semibold mt-6 mb-2">Existing Images</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {project.imagePaths.map((url, idx) => (
          <img key={idx} src={url} alt={`img-${idx}`} className="rounded border" />
        ))}
      </div>
    </div>
  );
}
