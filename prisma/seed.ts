import { prisma } from '../lib/prisma'
import { hash } from 'bcryptjs'

async function main() {
  const password = await hash('adminpass', 10)

  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password,
      role: 'ADMIN',
    },
  })

  console.log('✅ Admin created')
}

main()
  .then(() => process.exit(0))
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
