import { FastifyInstance } from 'fastify'
import { register, authenticate, profile } from './controllers'
import { verifyJwt } from './middlewares/verify-jwt'

export async function appRoutes(app: FastifyInstance) {
  app.post('/users', register)
  
  app.post('/auth', authenticate)

  app.get('/me', {
    onRequest: [verifyJwt],
  }, profile)
}
