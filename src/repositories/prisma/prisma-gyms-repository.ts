import { prisma } from '@/lib/prisma'
import { GymsRepositoryPort } from '../gyms-repository.port'

export class PrismaGymnsRepository implements GymsRepositoryPort {
  async findById(id: string) {
    return await prisma.gym.findUnique({
      where: {
        id,
      },
    })
  }
}
