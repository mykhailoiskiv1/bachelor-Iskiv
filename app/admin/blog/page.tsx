'use client';

import useSWR from 'swr';
import axios from 'axios';
import PostItem from '@/components/admin/blog/PostItem';
import PostForm from '@/components/admin/blog/PostForm';

type Post = {
  id: string;
  title: string;
  category: string;
  imagePath: string;
  createdAt: string;
};

const fetcher = (url: string) => axios.get(url).then(res => res.data);

export default function AdminBlogPage() {
  const { data: posts, mutate } = useSWR('/api/admin/blog/posts', fetcher);

  if (!posts) return <p className="text-center">Loading posts...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Blog Management</h1>

      <PostForm onSuccess={mutate} />

      <h2 className="text-xl font-semibold mb-3">Posts</h2>
      <div className="space-y-4">
        {posts.map((post: Post) => (
          <PostItem key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
