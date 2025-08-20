import { FastifyInstance } from 'fastify'
import { register } from './controlers/register.controler'
import { authenticate } from './controlers/authenticate.controler'

export async function appRoutes(app: FastifyInstance) {
  app.post('/users', register)
  app.post('/auth', authenticate)
}
