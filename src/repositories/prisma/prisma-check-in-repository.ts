import { Checkin, Prisma } from '@prisma/client'
import { CheckInRepositoryPort } from '../check-in-repository.port'
import { prisma } from '@/lib/prisma'
import dayjs from 'dayjs'

export class PrismaCheckInRepository implements CheckInRepositoryPort {
  async create(data: Prisma.CheckinUncheckedCreateInput) {
    return await prisma.checkin.create({
      data,
    })
  }

  async findByUserIdAndDate(userId: string, date: Date): Promise<Checkin | null> {
    const startOfTheDay = dayjs(date).startOf('date')
    const endOfTheDay = dayjs(date).endOf('date')

    const checkInOnSameDate = await prisma.checkin.findFirst({
      where: {
        user_id: userId,
        created_at: {
          gte: startOfTheDay.toDate(),
          lte: endOfTheDay.toDate(),
        }
      }
    })

    return checkInOnSameDate || null
  }
}