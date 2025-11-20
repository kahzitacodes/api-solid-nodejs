import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository'
import { GetNearByGymsService } from '../gyms/get-near-by-gyms.service'

export function makeGetNearByGymsService() {
  const gymRepository = new PrismaGymsRepository()
  const service = new GetNearByGymsService(gymRepository)
  
  return service
}