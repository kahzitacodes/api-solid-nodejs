import { prisma } from '@/lib/prisma'
import { GymsRepositoryPort } from '../gyms-repository.port'
import { Prisma, Gym } from '@prisma/client'

export class PrismaGymnsRepository implements GymsRepositoryPort {
  async create (data: Prisma.GymCreateInput) {
    const gym = await prisma.gym.create({
      data
    })

    return gym
  }

  async findMany ({ query, page, pageSize, }: { query: string; page: number; pageSize: number }) {
    const gyms = await prisma.gym.findMany({
      where: {
        name: {
          contains: query,
        }
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    })

    return gyms
  }

  async findManyNearBy ({ userLatitude, userLongitude, }: { userLatitude: number; userLongitude: number }) {
    const gyms = await prisma.$queryRaw<Gym[]>`
      SELECT * FROM gyms
      WHERE ( 6371 * acos( cos( radians(${userLatitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${userLongitude}) ) + sin( radians(${userLatitude}) ) * sin( radians( latitude ) ) ) ) <= 10
    `
    return gyms
  }

  async findById(id: string) {
    return await prisma.gym.findUnique({
      where: {
        id,
      },
    })
  }
}
