'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function BlogPageWrapper() {
  interface BlogPost {
    id: string;
    title: string;
    category: string;
    seoDescription?: string;
    content: string;
    slug: string;
    signedUrl: string;
  }

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch('/api/public/blog');
      const data = await res.json();
      setPosts(data);
    };
    fetchPosts();
  }, []);

  const uniqueCategories = ['All', ...Array.from(new Set(posts.map(p => p.category)))];

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(search.toLowerCase()) || 
                          post.seoDescription?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'All' || post.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">Our Blog</h1>


      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search articles..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border p-2 rounded"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-2 rounded"
        >
          {uniqueCategories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredPosts.map(post => (
          <Link 
            key={post.id} 
            href={`/blog/${post.slug}`} 
            className="border rounded hover:shadow-lg transition overflow-hidden"
          >
            <img 
              src={post.signedUrl} 
              alt={post.title} 
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="font-semibold text-lg mb-2">{post.title}</h2>
              <p className="text-sm text-gray-500 mb-2">{post.category}</p>
              <p className="text-sm text-gray-600">
                {post.seoDescription 
                  ? post.seoDescription.slice(0, 100) + '...' 
                  : post.content.slice(0, 100) + '...'}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <p className="text-center text-gray-500 mt-10">No articles found.</p>
      )}
    </div>
  );
}
