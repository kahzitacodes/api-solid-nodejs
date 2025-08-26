import { Checkin, Prisma } from '@prisma/client'

export interface CheckInRepositoryPort {
  create: (data: Prisma.CheckinUncheckedCreateInput) => Promise<Checkin>
  findByUserIdAndDate: (userId: string, date: Date) => Promise<Checkin | null>
  findManyByUserId: (userId: string, page: number, pageSize: number) => Promise<Checkin[]>
  countByUserId: (userId: string) => Promise<number>
}