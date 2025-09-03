import type { Gym } from "@prisma/client";
import { GymsRepositoryPort } from "@/repositories/gyms-repository.port";

interface SearchGymParams {
  query: string;
  page?: number
  pageSize?: number
}

interface SearchGymServiceResponse {
  gyms: Gym[];
}

export class SearchGymService {
  constructor(private gymsRepository: GymsRepositoryPort) {}

  async execute({
    query,
    page = 1,
    pageSize = 20
  }: SearchGymParams): Promise<SearchGymServiceResponse> {
    const gyms = await this.gymsRepository.findMany({
      query,
      page,
      pageSize
    });

    return {
      gyms
    };
  }
}
