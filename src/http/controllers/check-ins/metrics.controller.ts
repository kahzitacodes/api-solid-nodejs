import { FastifyReply, FastifyRequest } from 'fastify'
import { makeGetUserMetricsService } from '@/services/factories'

export async function metrics(request: FastifyRequest, reply: FastifyReply) {

  const getUserMetricsService = makeGetUserMetricsService()

  const { count } = await getUserMetricsService.execute({
    userId: request.user.sub,
  })

  return reply.status(200).send({ count })
}
