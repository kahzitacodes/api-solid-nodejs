import { CheckInRepositoryPort } from "@/repositories/check-in-repository.port";
import { GymsRepositoryPort } from "@/repositories/gyms-repository.port";
import { UsersRepositoryPort } from "@/repositories/users-repository.port";
import { UserNotFoundError } from "@/utils/errors";
import { Checkin } from "@prisma/client";

interface GetUserCheckInsHistoryRequest {
  userId: string;
  page?: number;
  pageSize?: number;
}

interface CreateGymServiceResponse {
  checkIns: Checkin[];
}

export class GetUserCheckInsHistoryService {
  constructor(
    private usersRepository: UsersRepositoryPort,
    private checkInRepository: CheckInRepositoryPort
  ) {}

  async execute({
    userId,
    page = 1,
    pageSize = 20,
  }: GetUserCheckInsHistoryRequest): Promise<CreateGymServiceResponse> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new UserNotFoundError();
    }

    const checkIns = await this.checkInRepository.findManyByUserId(
      userId,
      page,
      pageSize
    );

    return {
      checkIns,
    };
  }
}
