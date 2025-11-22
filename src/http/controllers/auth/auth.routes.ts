import { FastifyInstance } from 'fastify'
import { authenticate,  } from './authenticate.controller'
import { refreshToken } from './refresh-token.controller'

export async function authRoutes(app: FastifyInstance) {
  app.post('/auth', authenticate)
  app.patch('/auth/refresh-token', refreshToken)
}
