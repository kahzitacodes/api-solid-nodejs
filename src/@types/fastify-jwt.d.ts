import '@fastify/jwt'
import { ROLE } from '@prisma/client'

declare module '@fastify/jwt' {
  export interface FastifyJWT {
    user: {
      sub: string
      role: ROLE
    }
  }
}