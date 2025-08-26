import { describe, beforeEach, expect, it } from "vitest";
import * as bcrypt from "bcryptjs";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { InMemoryCheckInRepository } from "@/repositories/in-memory/in-memory-checkin-repository";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { GetUserCheckInsHistoryService } from "./get-user-check-ins-history.service";

describe("Get user check ins historic service", () => {
  let usersRepository: InMemoryUsersRepository;
  let checkInRepository: InMemoryCheckInRepository;
  let gymRepository: InMemoryGymsRepository;
  let sut: GetUserCheckInsHistoryService;

  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository();
    checkInRepository = new InMemoryCheckInRepository();
    gymRepository = new InMemoryGymsRepository();
    sut = new GetUserCheckInsHistoryService(usersRepository, checkInRepository);

    await gymRepository.create({
      id: "gym-1",
      name: "JavaScript Gym",
      description: "",
      phone: "",
      latitude: -27.2092052,
      longitude: -49.6401091,
      created_at: new Date(),
    });

    await usersRepository.create({
      id: "user-1",
      name: "Jane Doe",
      email: "jane.doe@email.com",
      password: await bcrypt.hash("123456", 6),
    });
  });

  it("should get checkIns history successfully", async () => {
    await checkInRepository.create({
      id: "checkin-1",
      gym_id: "gym-1",
      user_id: "user-1",
    });

    await checkInRepository.create({
      id: "checkin-2",
      gym_id: "gym-1",
      user_id: "user-1",
    });

        const { checkIns } = await sut.execute({
      userId: "user-1",
    });

    expect(checkIns).toHaveLength(2);
    expect(checkIns).toEqual([
      expect.objectContaining({ id: "checkin-1" }),
      expect.objectContaining({ id: "checkin-2" }),
    ]);
  });

  it("should paginate checkIns history", async () => {
    for (let i = 1; i <= 22; i++) {
      await checkInRepository.create({
        gym_id: `gym-${i}`,
        user_id: "user-1",
      });
    }

    const { checkIns } = await sut.execute({
      userId: "user-1",
      page: 2,
    });

    expect(checkIns).toHaveLength(2);
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: "gym-21" }),
      expect.objectContaining({ gym_id: "gym-22" }),
    ]);
  });
});
