import { describe, beforeEach, expect, it } from "vitest";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { SearchGymsService } from './search-gyms.service'

describe("Search gyms service", () => {
  let gymRepository: InMemoryGymsRepository;
  let sut: SearchGymsService;

  beforeEach(async () => {
    gymRepository = new InMemoryGymsRepository();
    sut = new SearchGymsService(gymRepository);
  });

  it("should get checkIns history successfully", async () => {
    await gymRepository.create({
      id: "gym-1",
      name: 'JavaScript Gym',
      description: "A great gym",
      phone: "123456789",
      latitude: 1.234,
      longitude: 5.678,
    });

    await gymRepository.create({
      id: "gym-2",
      name: 'Figma Gym',
      description: "A gym for designers",
      phone: "17897232",
      latitude: 1.234,
      longitude: 5.678,
    });

    const { gyms } = await sut.execute({
      query: "Figma",
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([
      expect.objectContaining({ name: "Figma Gym" })
    ]);
  });

    it("should paginate search results", async () => {
    for (let i = 1; i <= 22; i++) {
      await gymRepository.create({
        name: `JavaScript Gym ${i}`,
        description: "A great gym",
        phone: "123456789",
        latitude: 1.234,
        longitude: 5.678,
      });
    }

    const { gyms } = await sut.execute({
      query: "JavaScript",
      page: 2,
    });

    expect(gyms).toHaveLength(2);
    expect(gyms).toEqual([
      expect.objectContaining({ name: "JavaScript Gym 21" }),
      expect.objectContaining({ name: "JavaScript Gym 22" }),
    ]);
  });
});
