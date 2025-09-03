import { Gym, Prisma } from "@prisma/client";
import { GymsRepositoryPort } from "../gyms-repository.port";

export class InMemoryGymsRepository implements GymsRepositoryPort {
  public items: Gym[] = [];

  async findById(id: string) {
    return this.items.find((gym) => gym.id === id) || null;
  }

  async create(data: Prisma.GymCreateInput) {
    const gym = {
      id: data.id ?? crypto.randomUUID(),
      name: data.name,
      description: data.description ?? null,
      phone: data.phone ?? null,
      latitude: new Prisma.Decimal(Number(data.latitude)),
      longitude: new Prisma.Decimal(Number(data.longitude)),
      created_at: new Date(),
    };

    this.items.push(gym);

    return gym;
  }

  async findMany({
    query,
    page,
    pageSize,
  }: {
    query: string;
    page: number;
    pageSize: number;
  }): Promise<Gym[]> {
    return this.items
      .filter((item) => item.name.toLowerCase().includes(query.toLowerCase()))
      .slice((page - 1) * pageSize, page * pageSize);
  }
}
