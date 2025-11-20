import { describe, beforeEach, expect, it, afterEach, vi } from "vitest";
import { InMemoryCheckInRepository } from "@/repositories/in-memory/in-memory-checkin-repository";
import { ValidateCheckinService } from './validate-check-in.service'
import { CheckInNotFoundError } from '@/utils/errors/check-in/check-in-not-found.error'
import { LateCheckInValidationError } from '@/utils/errors/check-in/late-check-in-validation.error'

describe("Check In service", () => {
  let checkInRepository: InMemoryCheckInRepository;
  let sut: ValidateCheckinService;

  beforeEach(async () => {
    checkInRepository = new InMemoryCheckInRepository();
    sut = new ValidateCheckinService(
      checkInRepository
    );

    vi.useFakeTimers()
  });

  afterEach(() => {
    vi.useRealTimers()
  });

  it("should validate check in successfully", async () => {
    const createdCheckIn = await checkInRepository.create({
      gym_id: "gym-1",
      user_id: "user-1",
    });

    const { checkIn } = await sut.execute({
      checkInId: createdCheckIn.id,
    });

    expect(checkIn.validated_at).toEqual(expect.any(Date));
    expect(checkInRepository.checkins[0].validated_at).toEqual(expect.any(Date))
  });

  it("should not validate check in if it does not exist", async () => {
    await expect(() => sut.execute({
      checkInId: "non-existent-checkin-id"
    })).rejects.toBeInstanceOf(CheckInNotFoundError)
  });

  it("should not validate checkin 20 minutes after its creation", async () => {
    vi.setSystemTime(new Date(2025, 0, 1, 13, 40));

    const createdCheckIn = await checkInRepository.create({
      gym_id: "gym-1",
      user_id: "user-1",
    });

    const advanceMinutesInMs = 1000 * 60 * 21; // 21 minutes

    vi.advanceTimersByTime(advanceMinutesInMs);

    await expect(() => sut.execute({
      checkInId: createdCheckIn.id
    })).rejects.toBeInstanceOf(LateCheckInValidationError)
  })
})
