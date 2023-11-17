import { type Prisma, PrismaClient, Role } from '@prisma/client'
import { hash } from 'argon2'

const prisma = new PrismaClient()

const main = async function () {
  const accounts: Prisma.AccountCreateManyInput[] = [
    {
      username: 'user01',
      email: 'user01@example.com',
      role: Role.User,
      name: 'user01',
      password: await hash('1234')
    },
    {
      username: 'manager01',
      email: 'manager01@example.com',
      role: Role.Manager,
      name: 'manager01',
      password: await hash('1234')
    },
    {
      username: 'admin01',
      email: 'admin01@example.com',
      role: Role.Admin,
      name: 'admin01',
      password: await hash('1234')
    }
  ]

  await prisma.account.createMany({
    data: accounts
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
