import PostForm from '@/components/admin/blog/PostForm';

export default function CreatePostPage() {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create New Post</h1>
      <PostForm />
    </div>
  );
}
