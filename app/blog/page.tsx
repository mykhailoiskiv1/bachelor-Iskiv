import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { PostWithAuthor } from '@/types/post'

export default async function BlogPage() {
    const posts: PostWithAuthor[] = await prisma.post.findMany({
        orderBy: { createdAt: 'desc' },
        include: { author: { select: { id: true, email: true } } },
    })


    return (
        <div className="max-w-3xl mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Blog</h1>
            <ul className="space-y-4">
                {posts.map((post) => (
                    <li key={post.id} className="border p-4 rounded hover:bg-gray-50">
                        <Link href={`/blog/${post.slug}`} className="text-xl font-semibold hover:underline">
                            {post.title}
                        </Link>
                        <p className="text-sm text-gray-600 mt-1">
                            {new Date(post.createdAt).toLocaleDateString()}
                        </p>
                    </li>
                ))}
            </ul>
        </div>
    )
}