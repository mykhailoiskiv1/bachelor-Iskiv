import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { title, category, description, icon, isFeatured, isHot, sortOrder } = req.body;

    if (!title || !category) {
      return res.status(400).json({ message: 'Title and Category are required' });
    }

    const newService = await prisma.service.create({
      data: {
        title,
        category,
        description,
        icon,
        isFeatured,
        isHot,
        sortOrder: Number(sortOrder),
      },
    });

    return res.status(201).json(newService);
  } catch (error) {
    console.error('Error creating service:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

export async function GET() {
    const services = await prisma.service.findMany({
      orderBy: { sortOrder: 'asc' },
    });
  
    return NextResponse.json(services);
  }
  