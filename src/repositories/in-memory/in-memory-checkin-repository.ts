import { randomUUID } from 'node:crypto'
import dayjs from 'dayjs'
import { Checkin, Prisma } from '@prisma/client'
import { CheckInRepositoryPort } from '../check-in-repository.port'

export class InMemoryCheckInRepository implements CheckInRepositoryPort{
  public checkins: Checkin[] = []

  async create(data: Prisma.CheckinUncheckedCreateInput) {
    const checkIn = {
      id: data.id ?? randomUUID(),
      user_id: data.user_id,
      gym_id: data.gym_id,
      created_at: new Date(),
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
    }

    this.checkins.push(checkIn)

    return checkIn
  }

  async findByUserIdAndDate(userId: string, date: Date): Promise<Checkin | null> {
    const startOfTheDay = dayjs(date).startOf('date')
    const endOfTheDay = dayjs(date).endOf('date')

    const checkInOnSameDate = this.checkins.find((checkIn) => {
      const checkInDate = dayjs(checkIn.created_at)
      const isOnSameDate = checkInDate.isAfter(startOfTheDay) && checkInDate.isBefore(endOfTheDay)
      return checkIn.user_id === userId && isOnSameDate
    })

    return checkInOnSameDate || null
  }

  async findManyByUserId(userId: string, page: number, pageSize: number): Promise<Checkin[]> {
    return this.checkins
      .filter((checkIn) => checkIn.user_id === userId)
      .slice((page - 1) * pageSize, page * pageSize)
  }
}
