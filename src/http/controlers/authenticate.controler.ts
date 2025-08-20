import { z } from 'zod'
import { FastifyReply, FastifyRequest } from 'fastify'
import { InvalidCredentialsError } from '@/utils/errors'
import { makeAuthenticateService } from '@/services/factories'

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  })

  const {email, password} = registerBodySchema.parse(request.body)

  try {
    const authenticateService = makeAuthenticateService()

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
