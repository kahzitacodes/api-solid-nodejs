import type { Gym } from "@prisma/client";
import { GymsRepositoryPort } from "@/repositories/gyms-repository.port";

interface CreateGymParams {
  name: string;
  description: string | null;
  phone: string | null;
  latitude: number;
  longitude: number;
}

interface CreateGymServiceResponse {
  gym: Gym;
}

export class CreateGymService {
  constructor(private gymsRepository: GymsRepositoryPort) {}

  async execute({
    name,
    description,
    phone,
    latitude,
    longitude,
  }: CreateGymParams): Promise<CreateGymServiceResponse> {
    const newGym = await this.gymsRepository.create({
      name,
      description,
      phone,
      latitude,
      longitude,
    });

    return {
      gym: newGym,
    };
  }
}
