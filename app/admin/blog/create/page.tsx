import PostForm from '@/components/admin/blog/PostForm'

export default function CreatePostPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-light tracking-tight text-[var(--color-text-primary)] mb-8">
        Create New Post
      </h1>
      <PostForm mode="create" />
    </main>
  )
}
