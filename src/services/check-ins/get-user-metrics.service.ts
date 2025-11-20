import { CheckInRepositoryPort } from "@/repositories/check-in-repository.port";
import { UsersRepositoryPort } from "@/repositories/users-repository.port";
import { UserNotFoundError } from "@/utils/errors";
import { Checkin } from "@prisma/client";

interface GetUserMetricsRequest {
  userId: string;
}

interface CreateGymServiceResponse {
  count: number;
}

export class GetUserMetricsService {
  constructor(
    private usersRepository: UsersRepositoryPort,
    private checkInRepository: CheckInRepositoryPort
  ) {}

  async execute({
    userId,
  }: GetUserMetricsRequest): Promise<CreateGymServiceResponse> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new UserNotFoundError();
    }

    const count = await this.checkInRepository.countByUserId(
      userId,
    );

    return {
      count,
    };
  }
}
