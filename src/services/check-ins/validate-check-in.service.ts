import { CheckInRepositoryPort } from '@/repositories/check-in-repository.port'
import { CheckInNotFoundError } from '@/utils/errors/check-in/check-in-not-found.error'
import { LateCheckInValidationError } from '@/utils/errors/check-in/late-check-in-validation.error'
import { Checkin } from '@prisma/client'
import dayjs from 'dayjs'

interface ValidateCheckinServiceRequest {
  checkInId: string
}

interface ValidateCheckinServiceResponse {
  checkIn: Checkin
}

export class ValidateCheckinService {
  constructor(
    private checkInRepository: CheckInRepositoryPort,
  ) {}

  async execute({ checkInId }: ValidateCheckinServiceRequest): Promise<ValidateCheckinServiceResponse> {
    const checkIn = await this.checkInRepository.findById(checkInId)

    if (!checkIn) {
      throw new CheckInNotFoundError()
    }

    const distanceInMinutesFromCreation = dayjs(new Date()).diff(checkIn.created_at, 'minutes')

    if (distanceInMinutesFromCreation > 20) {
      throw new LateCheckInValidationError()
    }

    checkIn.validated_at = new Date()

    await this.checkInRepository.update(checkIn)

    return {
      checkIn
    }
  }
}