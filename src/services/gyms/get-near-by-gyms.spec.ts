import { describe, beforeEach, expect, it } from "vitest";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { GetNearByGymsService } from './get-near-by-gyms.service'

describe("Get nearby gyms service", () => {
  let gymRepository: InMemoryGymsRepository;
  let sut: GetNearByGymsService;

  beforeEach(async () => {
    gymRepository = new InMemoryGymsRepository();
    sut = new GetNearByGymsService(gymRepository);
  });

  it("should fetch nearby gyms successfully", async () => {
    await gymRepository.create({
      id: "gym-1",
      name: 'Near Gym',
      description: "A great gym",
      phone: "123456789",
      latitude: -27.2092052,
      longitude: -49.6401091,
    });

    await gymRepository.create({
      id: "gym-2",
      name: 'Far Gym',
      description: "A gym for designers",
      phone: "17897232",
      latitude: -27.0610928,
      longitude: -49.5229501,
    });

    const { gyms } = await sut.execute({
      userLatitude: -27.2092052,
      userLongitude: -49.6401091,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([
      expect.objectContaining({ name: "Near Gym" })
    ]);
  });
});
