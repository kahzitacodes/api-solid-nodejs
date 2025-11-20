import { env } from '@/env'
import { CheckInRepositoryPort } from '@/repositories/check-in-repository.port'
import { GymsRepositoryPort } from '@/repositories/gyms-repository.port'
import { UsersRepositoryPort } from '@/repositories/users-repository.port'
import { MaxDistanceError, GymNotFoundError, MaxCheckinsError, UserNotFoundError } from '@/utils/errors'
import { getDistanceBetweenCoordenates } from '@/utils/functions/get-distance-between-coordenates'
import { Checkin } from '@prisma/client'

interface CreateCheckinServiceRequest {
  userId: string
  gymId: string
  userLatitude: number
  userLongitude: number
}

interface CreateCheckinServiceResponse {
  checkIn: Checkin
}

export class CreateCheckinService {
  constructor(
    private usersRepository: UsersRepositoryPort,
    private checkInRepository: CheckInRepositoryPort,
    private gymsRepository: GymsRepositoryPort,
    private MAX_DISTANCE_IN_KILOMETERS = 0.1
  ) {}

  async execute({ userId, gymId, userLatitude, userLongitude }: CreateCheckinServiceRequest): Promise<CreateCheckinServiceResponse> {
    const user = await this.usersRepository.findById(userId)
    
    if (!user) {
      throw new UserNotFoundError()
    }

    const gym = await this.gymsRepository.findById(gymId)

    if (!gym) {
      throw new GymNotFoundError()
    }

    const distance = getDistanceBetweenCoordenates({
        latitude: userLatitude,
        longitude: userLongitude,
      }, {
        latitude: gym.latitude.toNumber(),
        longitude: gym.longitude.toNumber()
    })

    if (distance > this.MAX_DISTANCE_IN_KILOMETERS) {
      throw new MaxDistanceError()
    }

    const checkInOnSameDate = await this.checkInRepository.findByUserIdAndDate(userId, new Date())

    if (checkInOnSameDate) {
      throw new MaxCheckinsError()
    }

    const checkIn = await this.checkInRepository.create({
      user_id: user.id,
      gym_id: gymId,
    })  

    return {
      checkIn
    }
  }
}