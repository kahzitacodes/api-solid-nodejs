import { z } from 'zod'
import { FastifyReply, FastifyRequest } from 'fastify'
import { UserEmailAlreadyExists } from '@/utils/errors'
import { makeRegisterService } from '@/services/factories'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })

  const {email, name, password} = registerBodySchema.parse(request.body)

  try {
    const registerService = makeRegisterService()

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
