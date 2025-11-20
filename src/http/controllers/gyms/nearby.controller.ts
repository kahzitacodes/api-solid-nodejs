import { z } from 'zod'
import { FastifyReply, FastifyRequest } from 'fastify'
import { makeGetNearByGymsService } from '@/services/factories/make-get-near-by-gyms-service'

export async function nearby(request: FastifyRequest, reply: FastifyReply) {
  const nearByGymQuerySchema = z.object({
    latitude: z.coerce.number().refine((value) => {
      return Math.abs(value) <= 90
    }),
    longitude: z.coerce.number().refine((value) => {
      return Math.abs(value) <= 180
    }),
  })

  const {
    latitude,
    longitude
  } = nearByGymQuerySchema.parse(request.query)

  const getNearByGymsService = makeGetNearByGymsService()

  const { gyms } = await getNearByGymsService.execute({
    userLatitude: latitude,
    userLongitude: longitude
  })

  return reply.status(200).send({ gyms })
}
