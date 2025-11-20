import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { PrismaCheckInRepository } from '@/repositories/prisma/prisma-check-ins-repository'
import { GetUserMetricsService } from '../check-ins/get-user-metrics.service'

export function makeGetUserMetricsService() {
  const usersRepository = new PrismaUsersRepository()
  const checkInRepository = new PrismaCheckInRepository()
  const service = new GetUserMetricsService(usersRepository, checkInRepository)
  
  return service
}