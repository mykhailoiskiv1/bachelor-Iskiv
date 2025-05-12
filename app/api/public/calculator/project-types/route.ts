import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const types = await prisma.calcProjectType.findMany({
      orderBy: { sortOrder: 'asc' },
      include: {
        categories: {
          orderBy: { name: 'asc' },
        },
      },
    });

    return NextResponse.json(types);
  } catch (error) {
    console.error('❌ Failed to load project types:', error);
    return NextResponse.json({ error: 'Failed to load project types' }, { status: 500 });
  }
}
