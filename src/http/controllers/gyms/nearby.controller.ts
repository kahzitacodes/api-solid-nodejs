import { z } from 'zod'
import { FastifyReply, FastifyRequest } from 'fastify'
import { makeSearchGymsService } from '@/services/factories'
import { makeGetNearByGymsService } from '@/services/factories/make-get-near-by-gyms-service'

export async function nearby(request: FastifyRequest, reply: FastifyReply) {
  const nearByGymBodySchema = z.object({
    latitude: z.number().refine((value) => {
      return Math.abs(value) <= 90
    }),
    longitude: z.number().refine((value) => {
      return Math.abs(value) <= 180
    }),
  })

  const {
    latitude,
    longitude
  } = nearByGymBodySchema.parse(request.body)

  const getNearByGymsService = makeGetNearByGymsService()

  const { gyms } = await getNearByGymsService.execute({
    userLatitude: latitude,
    userLongitude: longitude
  })

  return reply.status(200).send({ gyms })
}
