import { Checkin, Prisma } from '@prisma/client'
import { CheckInRepositoryPort } from '../check-in-repository.port'
import { prisma } from '@/lib/prisma'
import dayjs from 'dayjs'

export class  PrismaCheckInRepository implements CheckInRepositoryPort {
  async findById(id: string) {
    const checkin = await prisma.checkin.findUnique({
      where: {
        id
      }
    })

    return checkin
  }

  async update (checkIn: Checkin) {
    const updatedCheckIn = await prisma.checkin.update({
      where: {
        id: checkIn.id
      },
      data: checkIn
    })

    return updatedCheckIn
  }

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

  async findManyByUserId(userId: string, page:number, pageSize: number): Promise<Checkin[]> {
    return await prisma.checkin.findMany({
      where: {
        user_id: userId
      },
      orderBy: {
        created_at: 'asc'
      },
      skip: (page - 1) * pageSize,
      take: pageSize
    })
  }

    async countByUserId(userId: string) {
    const count = await prisma.checkin.count({
      where: {
        user_id: userId
      }
    })

    return count
  }
}