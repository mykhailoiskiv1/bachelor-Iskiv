'use client'

import Link from 'next/link'

type Post = {
  id: string
  title: string
  category: string
  imagePath: string
  createdAt: string
}

export default function PostItem({ post }: { post: Post }) {
  return (
    <div className="border p-4 rounded flex items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        {post.imagePath ? (
          <img
            src={post.imagePath}
            alt={post.title}
            className="w-24 h-24 object-cover rounded"
          />
        ) : (
          <div className="w-24 h-24 bg-gray-200 flex items-center justify-center text-xs">
            No Image
          </div>
        )}
        <div>
          <h3 className="font-bold">{post.title}</h3>
          <p className="text-sm text-gray-500">{post.category}</p>
          <p className="text-xs text-gray-400">
            Created: {new Date(post.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      <Link
        href={`/admin/blog/edit/${post.id}`}
        className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500 text-sm"
      >
        Edit
      </Link>
    </div>
  )
}
