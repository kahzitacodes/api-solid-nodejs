import type { Gym } from "@prisma/client";
import { GymsRepositoryPort } from "@/repositories/gyms-repository.port";

interface SearchGymsParams {
  query: string;
  page?: number
  pageSize?: number
}

interface SearchGymsServiceResponse {
  gyms: Gym[];
}

export class SearchGymsService {
  constructor(private gymsRepository: GymsRepositoryPort) {}

  async execute({
    query,
    page = 1,
    pageSize = 20
  }: SearchGymsParams): Promise<SearchGymsServiceResponse> {
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
