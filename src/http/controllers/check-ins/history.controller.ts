import { z } from 'zod'
import { FastifyReply, FastifyRequest } from 'fastify'
import { makeGetUserCheckInsHistoryService } from '@/services/factories'

export async function history(request: FastifyRequest, reply: FastifyReply) {
  const searchGymQuerySchema = z.object({
    page: z.coerce.number().optional().default(1),
    pageSize: z.coerce.number().optional().default(20),
  })

  const {
    page,
    pageSize
  } = searchGymQuerySchema.parse(request.query)

  const getUserCheckInsHistoryService = makeGetUserCheckInsHistoryService()

  const { checkIns } = await getUserCheckInsHistoryService.execute({
    userId: request.user.sub,
    page,
    pageSize
  })

  return reply.status(200).send({checkIns})
}
