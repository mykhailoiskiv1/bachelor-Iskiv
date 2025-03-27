import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'

async function main() {
  const adminPassword = await hash('adminpass', 10)
  const clientPassword = await hash('clientpass', 10)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: adminPassword,
      role: 'ADMIN',
    },
  })

  await prisma.user.upsert({
    where: { email: 'client1@example.com' },
    update: {},
    create: {
      email: 'client1@example.com',
      password: clientPassword,
      role: 'CLIENT',
    },
  })

  await prisma.user.upsert({
    where: { email: 'client2@example.com' },
    update: {},
    create: {
      email: 'client2@example.com',
      password: clientPassword,
      role: 'CLIENT',
    },
  })

  await prisma.post.upsert({
    where: { slug: 'welcome-to-our-blog' },
    update: {},
    create: {
      title: 'Welcome to Our Blog',
      slug: 'welcome-to-our-blog',
      content: 'This is our first post in the construction company blog. Stay tuned!',
      imageUrl: '/demo-cover.jpg',
      authorId: admin.id,
    },
  })

  console.log('✅ Admin, Clients, and Demo Blog Post created')
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e)
    prisma.$disconnect()
    process.exit(1)
  })
