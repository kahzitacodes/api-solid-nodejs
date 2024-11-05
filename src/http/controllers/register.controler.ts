import { z } from 'zod'
import { FastifyReply, FastifyRequest } from 'fastify'
import { RegisterService } from '@/services/register'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users.repository'
import { UserEmailAlreadyExists } from '@/services/errors/users/user-email-already-exists.error'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })

  const {email, name, password} = registerBodySchema.parse(request.body)

  try {
    const usersRepository = new PrismaUsersRepository()
    const registerService = new RegisterService(usersRepository)

    await registerService.execute({email, name, password})

    return reply.status(201).send()
  } catch (error) {
    console.log(error)
    if (error instanceof UserEmailAlreadyExists) {
      return reply.status(409).send({ message : error.message })
    }
    return reply.status(500).send()
  }
}
