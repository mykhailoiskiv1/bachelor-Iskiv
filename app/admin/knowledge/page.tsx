// app/admin/knowledge/page.tsx

'use client';

import useSWR from 'swr';
import axios from 'axios';
import Link from 'next/link';
import { Plus, Pencil } from 'lucide-react';

type Item = {
    id: number;
    title: string;
    createdAt: string;
};




const fetcher = (url: string) => axios.get(url).then(res => res.data);

export default function KnowledgeBaseListPage() {
    const { data: items, error, isLoading } = useSWR<Item[]>('/api/admin/knowledge-base', fetcher);

    return (
        <div className="max-w-4xl mx-auto px-4 py-10">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-semibold text-[var(--color-text-primary)]">Knowledge Base</h1>
                <Link
                    href="/admin/knowledge/create"
                    className="flex items-center gap-2 px-4 py-2 text-sm bg-[var(--color-accent)] text-white rounded-full shadow hover:bg-opacity-90"
                >
                    <Plus size={16} /> Add New
                </Link>
            </div>

            {isLoading && <p>Loading...</p>}
            {error && <p className="text-red-500">Failed to load knowledge base.</p>}

            <ul className="space-y-4">
                {items?.map(item => (
                    <li key={item.id} className="border rounded p-4 bg-white shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-medium text-[var(--color-text-primary)]">{item.title}</h2>
                                <p className="text-sm text-gray-500">
                                    Created: {new Date(item.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                            <Link
                                href={`/admin/knowledge/${item.id}`}
                                className="text-[var(--color-accent)] hover:underline text-sm flex items-center gap-1"
                            >
                                <Pencil size={14} /> Edit
                            </Link>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
