import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const projects = await prisma.clientProject.findMany({
    where: { deletedAt: null },
    include: { client: true },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(projects)
}

export async function POST(req: Request) {
  const data = await req.json()

  const newProject = await prisma.clientProject.create({
    data: {
      name: data.name,
      status: data.status,
      startDate: new Date(data.startDate),
      endDate: data.endDate ? new Date(data.endDate) : undefined,
      clientId: data.clientId,
    },
  })

  return NextResponse.json(newProject, { status: 201 })
}

export async function DELETE(req: Request) {
  const { id } = await req.json()

  const deleted = await prisma.clientProject.update({
    where: { id },
    data: { deletedAt: new Date() },
  })

  return NextResponse.json(deleted)
}
