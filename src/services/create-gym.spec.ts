import { describe, beforeEach, expect, it } from "vitest";
import { compare } from "bcryptjs";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { UserEmailAlreadyExists } from "@/utils/errors";
import { RegisterService } from "./register.service";
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { CreateGymService } from './create-gym.service'

describe("Create gym service", () => {
  let gymsRepository: InMemoryGymsRepository;
  let sut: CreateGymService;

  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new CreateGymService(gymsRepository);
  });

  it("should create gym successfully", async () => {
    const { gym } = await sut.execute({
      name: "Gym A",
      description: "A great gym",
      phone: "123456789",
      latitude: 1.234,
      longitude: 5.678,
    });

    expect(gym.id).toEqual(expect.any(String));
  });
});
