import { FastifyInstance } from 'fastify'
import { verifyJwt } from '@/http/middlewares/verify-jwt'
import { nearby } from './nearby.controller'
import { search } from './search.controller'
import { create } from './create.controller'
import { verifyUserRole } from '@/http/middlewares/verify-user-role'


export async function gymRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt)

  app.get('/gyms/nearby', nearby)
  app.get('/gyms/search', search)
  
  app.post('/gyms', {
    onRequest: [verifyUserRole('ADMIN')]
  }, create)
}
