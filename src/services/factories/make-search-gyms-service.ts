import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository'
import { SearchGymsService } from '../search-gyms.service'

export function makeSearchGymsService() {
  const gymRepository = new PrismaGymsRepository()
  const service = new SearchGymsService(gymRepository)
  
  return service
}