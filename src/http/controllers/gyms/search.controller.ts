import { z } from 'zod'
import { FastifyReply, FastifyRequest } from 'fastify'
import { makeSearchGymsService } from '@/services/factories'

export async function search(request: FastifyRequest, reply: FastifyReply) {
  const searchGymBodySchema = z.object({
    q: z.string(),
    page: z.coerce.number().optional().default(1),
    pageSize: z.coerce.number().optional().default(20),
  })

  const {
    q,
    page,
    pageSize
  } = searchGymBodySchema.parse(request.body)

  const searchGymsService = makeSearchGymsService()

  const { gyms } = await searchGymsService.execute({
    query: q,
    page,
    pageSize
  })

  return reply.status(200).send({gyms})
}
