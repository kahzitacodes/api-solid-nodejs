import { Gym, Prisma } from "@prisma/client";

export interface GymsRepositoryPort {
  findById: (id: string) => Promise<Gym | null>;
  create: (data: Prisma.GymCreateInput) => Promise<Gym>;
  findMany: ({
    query,
    page,
    pageSize,
  }: {
    query: string;
    page: number;
    pageSize: number;
  }) => Promise<Gym[]>;
    findManyNearBy: ({
    userLatitude,
    userLongitude,
  }: {
    userLatitude: number;
    userLongitude: number;
  }) => Promise<Gym[]>;
}
