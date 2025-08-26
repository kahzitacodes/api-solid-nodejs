import { describe, beforeEach, expect, it, vi, afterEach } from "vitest";
import * as bcrypt from "bcryptjs";
import { MaxDistanceError, MaxCheckinsError } from "@/utils/errors";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { InMemoryCheckInRepository } from "@/repositories/in-memory/in-memory-checkin-repository";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { CreateCheckinService } from "./check-in.service";

describe("Check In service", () => {
  let usersRepository: InMemoryUsersRepository;
  let checkInRepository: InMemoryCheckInRepository;
  let gymRepository: InMemoryGymsRepository;
  let sut: CreateCheckinService;

  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository();
    checkInRepository = new InMemoryCheckInRepository();
    gymRepository = new InMemoryGymsRepository();
    sut = new CreateCheckinService(
      usersRepository,
      checkInRepository,
      gymRepository
    );

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

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should check in successfully", async () => {
    vi.setSystemTime(new Date(2024, 10, 1, 12, 0, 0));

    const { checkIn } = await sut.execute({
      userId: "user-1",
      gymId: "gym-1",
      userLatitude: -27.2092052,
      userLongitude: -49.6401091,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("should not be able to check in twice in the same day", async () => {
    vi.setSystemTime(new Date(2024, 10, 1, 12, 0, 0));

    await sut.execute({
      userId: "user-1",
      gymId: "gym-1",
      userLatitude: -27.2092052,
      userLongitude: -49.6401091,
    });

    await expect(() =>
      sut.execute({
        userId: "user-1",
        gymId: "gym-1",
        userLatitude: -27.2092052,
        userLongitude: -49.6401091,
      })
    ).rejects.toBeInstanceOf(MaxCheckinsError);
  });

  it("should be able to check in twice in different days", async () => {
    vi.setSystemTime(new Date(2024, 10, 1, 12, 0, 0));

    await sut.execute({
      userId: "user-1",
      gymId: "gym-1",
      userLatitude: -27.2092052,
      userLongitude: -49.6401091,
    });

  vi.setSystemTime(new Date(2024, 10, 2, 12, 0, 0));

    const { checkIn } = await sut.execute({
      userId: "user-1",
      gymId: "gym-1",
      userLatitude: -27.2092052,
      userLongitude: -49.6401091,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("Should not check in on distant gym", async () => {
    vi.setSystemTime(new Date(2024, 10, 1, 12, 0, 0));

    await gymRepository.create({
      id: "gym-2",
      name: "JavaScript Gym",
      description: "",
      phone: "",
      latitude: -27.0747279,
      longitude: -49.4889672,
      created_at: new Date(),
    });

    expect(() =>
      sut.execute({
        userId: "user-1",
        gymId: "gym-2",
        userLatitude: -27.2092052,
        userLongitude: -49.6401091,
      })
    ).rejects.toBeInstanceOf(MaxDistanceError);
  });
});
