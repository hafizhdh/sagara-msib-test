import { PrismaClient, Size } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  const clothes = [
    {
      color: 'red',
      size: Size.S,
      price: 200000,
      stock: 10
    },
    {
      color: 'blue',
      size: Size.XS,
      price: 190000,
      stock: 14
    },
    {
      color: 'green',
      size: Size.XL,
      price: 220000,
      stock: 18
    }
  ]

  clothes.map(async (item) => {
    await prisma.clothes.create({
      data: item
    })
  })
}

main()
  .then(async () => {
    console.log('Success!');
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    console.log('Error in seeding');
    await prisma.$disconnect();
    process.exit(1);
  });