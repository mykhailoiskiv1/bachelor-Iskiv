import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSignedUrl } from '@/lib/gcs/getSignedUrl';

export async function GET() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
  });

  const postsWithUrls = await Promise.all(
    posts.map(async (post) => {
      const signedUrl = await getSignedUrl(post.imagePath);
      return { ...post, signedUrl };
    })
  );

  return NextResponse.json(postsWithUrls);
}
