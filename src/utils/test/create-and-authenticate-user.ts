import { prisma } from '@/lib/prisma'
import { ROLE } from '@prisma/client'
import { hash } from 'bcryptjs'
import { FastifyInstance } from "fastify";
import request from "supertest";

export async function createAndAuthenticateUser(app: FastifyInstance, role?: ROLE) {
  const user = await prisma.user.create({
    data: {
      name: "John Doe",
      email: "john.doe@example.com",
      password: await hash("123456", 6),
      role: role ?? 'MEMBER',
    }
  })
  await request(app.server).post("/users").send({
    name: "John Doe",
    email: "john.doe@example.com",
    password: "123456",
  });

  const authResponse = await request(app.server).post("/auth").send({
    email: "john.doe@example.com",
    password: "123456",
  });

  const { token } = authResponse.body;

  return {
    token
  };
}
