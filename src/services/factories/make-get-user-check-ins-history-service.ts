import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { PrismaCheckInRepository } from '@/repositories/prisma/prisma-check-ins-repository'
import { GetUserCheckInsHistoryService } from '../get-user-check-ins-history.service'

export function makeGetUserCheckInsHistoryService() {
  const usersRepository = new PrismaUsersRepository()
  const checkInRepository = new PrismaCheckInRepository()
  const service = new GetUserCheckInsHistoryService(usersRepository, checkInRepository)
  
  return service
}