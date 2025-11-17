import { FastifyInstance } from 'fastify'
import { authenticate,  } from './authenticate.controller'

export async function authRoutes(app: FastifyInstance) {
  
  app.post('/auth', authenticate)
}
