import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

type Props = {
    params: Promise<{ slug: string }>;
};

export default async function PublicProjectPage({ params }: Props) {
    const { slug } = await params;

    const project = await prisma.project.findUnique({
        where: { slug },
    });

    if (!project) return notFound();

    const firstImage = project.imagePaths?.[0];

    return (
        <main className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-2">{project.title}</h1>
            <p className="text-sm text-gray-500 mb-6">
                {project.category} | {new Date(project.createdAt).toLocaleDateString()}
            </p>
            {firstImage ? (
                <img
                    src={firstImage}
                    alt={project.title}
                    className="w-full h-64 object-cover rounded mb-6"
                />
            ) : (
                <div className="h-64 bg-gray-200 flex items-center justify-center rounded text-gray-500">
                    No image available
                </div>
            )}
            <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: project.content }}
            />
        </main>
    );
}
