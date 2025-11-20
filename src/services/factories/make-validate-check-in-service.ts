import { PrismaCheckInRepository } from '@/repositories/prisma/prisma-check-ins-repository'
import { ValidateCheckinService } from '../check-ins/validate-check-in.service'

export function makeValidateCheckInService() {
  const checkInRepository = new PrismaCheckInRepository()
  const service = new ValidateCheckinService(checkInRepository)
  
  return service
}