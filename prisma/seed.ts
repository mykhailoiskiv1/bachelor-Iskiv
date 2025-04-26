import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.service.deleteMany(); 

  await prisma.service.createMany({
    data: [
      {
        title: 'House Wiring',
        category: 'Electricity',
        icon: 'Zap',
        isFeatured: true,
        sortOrder: 1,
        isHot: true,
      },
      {
        title: 'Bathroom Plumbing',
        category: 'Plumbing',
        icon: 'Droplet',
        isFeatured: true,
        sortOrder: 2,
      },
      {
        title: 'Garage Conversions',
        category: 'Building',
        icon: 'Home',
        isFeatured: true,
        sortOrder: 3,
      },
      {
        title: 'LED Lighting',
        category: 'Electricity',
        icon: 'Sun',
        isFeatured: false,
        sortOrder: 4,
      },
    ],
  });

  console.log('✅ Services seeded successfully!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
