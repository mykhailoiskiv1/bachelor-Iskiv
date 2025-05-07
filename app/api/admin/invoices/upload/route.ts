import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth'
import { uploadFileToGCS } from '@/lib/gcs/uploadFileToGCS'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const formData = await req.formData()
  const file = formData.get('file') as File
  const title = formData.get('title') as string
  const clientId = formData.get('clientId') as string
  const totalAmount = parseFloat(formData.get('totalAmount') as string)
  const projectName = formData.get('projectName') as string

  if (!file || !clientId || !title || isNaN(totalAmount) || !projectName) {
    return NextResponse.json({ error: 'Missing or invalid fields' }, { status: 400 })
  }

  const buffer = Buffer.from(await file.arrayBuffer())

  const rawName = file.name.trim()
  const cleanedFilename = rawName.replace(/[^a-zA-Z0-9_.-]/g, '_')
  const safeFilename = `${Date.now()}-${cleanedFilename}`

  const fileUrl = await uploadFileToGCS(buffer, safeFilename, file.type, 'invoices')

  const invoice = await prisma.invoice.create({
    data: {
      title,
      clientId,
      fileUrl,
      totalAmount,
      projectName,
    },
  })

  return NextResponse.json(invoice, { status: 201 })
}
