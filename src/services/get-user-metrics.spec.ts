import { describe, beforeEach, expect, it } from "vitest";
import * as bcrypt from "bcryptjs";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { InMemoryCheckInRepository } from "@/repositories/in-memory/in-memory-checkin-repository";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { GetUserMetricsService } from './get-user-metrics.service'

describe("Get user metrics service", () => {
  let usersRepository: InMemoryUsersRepository;
  let checkInRepository: InMemoryCheckInRepository;
  let gymRepository: InMemoryGymsRepository;
  let sut: GetUserMetricsService;

  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository();
    checkInRepository = new InMemoryCheckInRepository();
    gymRepository = new InMemoryGymsRepository();
    sut = new GetUserMetricsService(usersRepository, checkInRepository);
    
    await usersRepository.create({
      id: "user-1",
      name: "Jane Doe",
      email: "jane.doe@email.com",
      password: await bcrypt.hash("123456", 6),
    });
  });

  it("should get total number of checkins", async () => {
    for (let i = 1; i <= 8; i++) {
      await checkInRepository.create({
        gym_id: `gym-${i}`,
        user_id: "user-1",
      });
    }

    const { count } = await sut.execute({
      userId: "user-1",
    });

    expect(count).toEqual(8);
  });
});
