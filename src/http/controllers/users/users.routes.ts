import { FastifyInstance } from 'fastify'
import { verifyJwt } from '@/http/middlewares/verify-jwt'
import { register } from './register.controller'
import { profile } from './profile.controller'


export async function userRoutes(app: FastifyInstance) {
  app.post('/users', register)

  app.get('/me', {
    onRequest: [verifyJwt],
  }, profile)
}
