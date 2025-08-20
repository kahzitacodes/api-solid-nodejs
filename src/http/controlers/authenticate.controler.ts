import { z } from 'zod'
import { FastifyReply, FastifyRequest } from 'fastify'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { AuthenticateService } from '@/services/authenticate.service'
import { InvalidCredentialsError } from '@/utils/errors/authenticate/invalid-crendentials.error'

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  })

  const {email, password} = registerBodySchema.parse(request.body)

  try {
    const usersRepository = new PrismaUsersRepository()
    const authenticateService = new AuthenticateService(usersRepository)

    const user = await authenticateService.execute({email, password})

    return reply.status(200).send(user)
  } catch (error) {
    console.log(error)
    if (error instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message : error.message })
    }
    return reply.status(500).send()
  }
}
