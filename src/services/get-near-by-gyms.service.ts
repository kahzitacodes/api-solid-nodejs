import type { Gym } from "@prisma/client";
import { GymsRepositoryPort } from "@/repositories/gyms-repository.port";

interface GetNearByGymsParams {
  userLatitude: number;
  userLongitude: number;
}

interface GetNearByGymsServiceResponse {
  gyms: Gym[];
}

export class GetNearByGymsService {
  constructor(private gymsRepository: GymsRepositoryPort) {}

  async execute({
    userLatitude,
    userLongitude
  }: GetNearByGymsParams): Promise<GetNearByGymsServiceResponse> {
    const gyms = await this.gymsRepository.findManyNearBy({
      userLatitude,
      userLongitude,
    });

    return {
      gyms
    };
  }
}
