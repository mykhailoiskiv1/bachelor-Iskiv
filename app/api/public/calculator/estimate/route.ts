import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type EstimateItem = {
  id: number;
  quantity: number;
  conditionIds: number[];
};

type EstimateBody = {
  items: EstimateItem[];
  urgency?: 'normal' | 'urgent' | 'emergency';
};

export async function POST(req: NextRequest) {
  try {
  const body: EstimateBody = await req.json();

  if (!Array.isArray(body.items) || body.items.length === 0) {
    return NextResponse.json({ error: 'No items provided' }, { status: 400 });
  }

  const settings = await prisma.calcSettings.findFirst();
  if (!settings) {
    return NextResponse.json({ error: 'Settings not configured' }, { status: 500 });
  }

    let totalMin = 0;
    let totalMax = 0;

    for (const entry of body.items) {
      const item = await prisma.calcItem.findUnique({
        where: { id: entry.id },
        include: { conditions: true },
      });

      if (!item) {
        return NextResponse.json({ error: `Item ${entry.id} not found` }, { status: 400 });
      }

      let multiplier = 1;

      if (Array.isArray(entry.conditionIds)) {
        for (const id of entry.conditionIds) {
          const cond = item.conditions.find(c => c.id === id);
          if (cond) multiplier *= cond.multiplier;
        }
      }

      const baseMin = item.minPrice * entry.quantity * multiplier;
      const baseMax = item.maxPrice * entry.quantity * multiplier;

      totalMin += baseMin;
      totalMax += baseMax;
    }

    if (body.urgency === 'urgent') {
      totalMin *= settings.urgencyMultiplier;
      totalMax *= settings.urgencyMultiplier;
    } else if (body.urgency === 'emergency') {
      totalMin *= settings.emergencyMultiplier;
      totalMax *= settings.emergencyMultiplier;
    }

    if (totalMin < settings.callOutThreshold) {
      totalMin += settings.callOutFeeMin;
      totalMax += settings.callOutFeeMax;
    }

    if (totalMax > settings.projectTrigger) {
      const surcharge = (settings.projectFeePercent / 100);
      totalMin += totalMin * surcharge;
      totalMax += totalMax * surcharge;
    }

    return NextResponse.json({
      success: true,
      minTotal: Math.round(totalMin),
      maxTotal: Math.round(totalMax),
    });

  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
