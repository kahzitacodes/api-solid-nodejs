import type { Gym } from "@prisma/client";
import { GymsRepositoryPort } from "@/repositories/gyms-repository.port";

interface GetNearByGymParams {
  userLatitude: number;
  userLongitude: number;
}

interface GetNearByGymServiceResponse {
  gyms: Gym[];
}

export class GetNearByGymService {
  constructor(private gymsRepository: GymsRepositoryPort) {}

  async execute({
    userLatitude,
    userLongitude
  }: GetNearByGymParams): Promise<GetNearByGymServiceResponse> {
    const gyms = await this.gymsRepository.findManyNearBy({
      userLatitude,
      userLongitude,
    });

    return {
      gyms
    };
  }
}
