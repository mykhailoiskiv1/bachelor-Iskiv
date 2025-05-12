import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

type EstimateItem = {
  id: number;
  quantity: number;
  conditionIds?: number[];
};

type RequestPayload = {
  name: string;
  email: string;
  phone: string;
  postcode: string;
  categorySlug: string;
  data: EstimateItem[];
  urgency: 'standard' | 'urgent' | 'emergency';
  estimateMin: number;
  estimateMax: number;
};


export async function POST(req: NextRequest) {
  try {
    const body: RequestPayload = await req.json();

    if (!body.name || !body.email || !body.phone || !body.postcode) {
      return NextResponse.json({ error: 'Missing contact information' }, { status: 400 });
    }

    const request = await prisma.calcRequest.create({
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone,
        postcode: body.postcode,
        categorySlug: body.categorySlug,
        data: body.data,
        urgency: body.urgency,
        estimateMin: body.estimateMin,
        estimateMax: body.estimateMax,
      },
    });

    return NextResponse.json({ success: true, id: request.id });
  } catch (error) {
    console.error('Error saving calculator request:', error);
    return NextResponse.json({ error: 'Failed to save request' }, { status: 500 });
  }
}
