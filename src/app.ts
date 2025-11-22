import fastify from 'fastify'
import fastifyJwt from '@fastify/jwt'
import fastifyCookie from '@fastify/cookie'
import { ZodError } from 'zod'
import { env } from './env'
import { userRoutes } from './http/controllers/users/users.routes'
import { authRoutes } from './http/controllers/auth/auth.routes'
import { gymRoutes } from './http/controllers/gyms/gyms.routes'
import { checkinsRoutes } from './http/controllers/check-ins/check-ins.routes'

export const app = fastify()

app.register(authRoutes)
app.register(userRoutes)
app.register(gymRoutes)
app.register(checkinsRoutes)
app.register(fastifyCookie)

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: 'refreshToken',
    signed: false,
  },
  sign: {
    expiresIn: '10m',
  }
})

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({ message: 'Validation error', issue:  error.format()})
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  } else {
    // TODO: add log
  }

  return reply.status(500).send({ message: 'Internal server error' })
})
