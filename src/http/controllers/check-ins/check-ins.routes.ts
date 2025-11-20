import { FastifyInstance } from 'fastify'
import { verifyJwt } from '@/http/middlewares/verify-jwt'
import { create } from './create.controller'
import { validate } from './validate.controller'
import { metrics } from './metrics.controller'
import { history } from './history.controller'


export async function checkinsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt)

  app.get('/check-ins', history)
  app.get('/check-ins/metrics', metrics)
  app.post('/check-ins/:gymId', create)
  app.patch('/check-ins/:checkInId/validate', validate)
}
