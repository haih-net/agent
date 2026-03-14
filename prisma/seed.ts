import { Prisma, PrismaClient } from '@prisma/client'
import { createPassword } from '../server/schema/types/User/helpers/createPassword'

const prisma = new PrismaClient()

const userData: Prisma.UserCreateInput[] = []

async function main() {
  // eslint-disable-next-line no-console
  console.log(`Start seeding ...`)

  const password = process.env.SUDO_PASSWORD
  if (password) {
    userData.push({
      username: 'admin',
      password: await createPassword(password),
      sudo: true,
      status: 'active',
    })
  }

  for (const u of userData) {
    if (u.username) {
      const userExists = await prisma.user.findUnique({
        where: {
          username: u.username,
        },
      })

      if (userExists) {
        continue
      }

      await prisma.user
        .create({
          data: u,
        })
        .then((user) => {
          // eslint-disable-next-line no-console
          console.log(`Created user with id: ${user.id}`)
        })
        .catch(console.error)
    }
  }

  // Dev seed
  // await devSeed(prisma)

  // eslint-disable-next-line no-console
  console.log(`Seeding finished.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
