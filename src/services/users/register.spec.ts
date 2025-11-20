import { describe, beforeEach, expect, it } from "vitest";
import { compare } from "bcryptjs";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { UserEmailAlreadyExists } from "@/utils/errors";
import { RegisterService } from "./register.service";

describe("Register service", () => {
  let usersRepository: InMemoryUsersRepository;
  let sut: RegisterService;

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new RegisterService(usersRepository);
  });

  it("should register user successfully", async () => {
    const { user } = await sut.execute({
      name: "John Doe",
      email: "john.dow@email.com",
      password: "123456",
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("should hash password on signup", async () => {
    const { user } = await sut.execute({
      name: "John Doe",
      email: "john.dow@email.com",
      password: "123456",
    });

    const isPasswordHashad = await compare("123456", user.password);

    expect(isPasswordHashad).toBe(true);
  });

  it("should not allow duplicate email", async () => {
    const email = "johndoe@email.com";

    await sut.execute({
      name: "John Doe",
      email,
      password: "123456",
    });

    await expect(() =>
      sut.execute({
        name: "John Doe",
        email,
        password: "123456",
      })
    ).rejects.toBeInstanceOf(UserEmailAlreadyExists);
  });
});
