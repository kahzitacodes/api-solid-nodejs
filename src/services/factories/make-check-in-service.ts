import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { PrismaCheckInRepository } from '@/repositories/prisma/prisma-check-ins-repository'
import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository'
import { CreateCheckinService } from '../check-in.service'

export function makeCheckInService() {
  const usersRepository = new PrismaUsersRepository()
  const gymsRepository = new PrismaGymsRepository()
  const checkInRepository = new PrismaCheckInRepository()

  const checkInService = new CreateCheckinService(
    usersRepository,
    checkInRepository,
    gymsRepository
  )

  return checkInService
}