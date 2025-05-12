import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('category');

  if (!slug) {
    return NextResponse.json({ error: 'Missing category parameter' }, { status: 400 });
  }

  try {
    const category = await prisma.calcCategory.findUnique({
      where: { slug },
      include: {
        items: {
          where: { visible: true },
          orderBy: { name: 'asc' },
          include: {
            conditions: true,
          },
        },
      },
    });

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json(category.items);
  } catch (error) {
    console.error('Error fetching items:', error);
    return NextResponse.json({ error: 'Failed to fetch items' }, { status: 500 });
  }
}
