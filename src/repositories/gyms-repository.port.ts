import { Gym, Prisma } from '@prisma/client'

export interface GymsRepositoryPort {
  findById: (id: string) => Promise<Gym | null>
  create: (data: Prisma.GymCreateInput) => Promise<Gym>
}