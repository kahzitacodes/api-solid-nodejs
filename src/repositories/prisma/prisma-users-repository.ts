import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { UsersRepositoryPort } from '../users-repository.port'

export class PrismaUsersRepository implements UsersRepositoryPort{
  async create(data: Prisma.UserCreateInput) {
    return await prisma.user.create({
      data,
    })
  }

  async findByEmail(email: string) {
    return await prisma.user.findUnique({
      where: {
        email,
      },
    })
  }

  async findById(id: string) {
    return await prisma.user.findUnique({
      where: {
        id,
      },
    })
  }
}
