import { z } from 'zod'
import { FastifyReply, FastifyRequest } from 'fastify'
import { InvalidCredentialsError } from '@/utils/errors'
import { makeAuthenticateService } from '@/services/factories'

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  })

  const {email, password} = registerBodySchema.parse(request.body)

  try {
    const authenticateService = makeAuthenticateService()

    const { user } = await authenticateService.execute({ email, password })

    const token = await reply.jwtSign(
      {
        role: user.role
      }, 
      {
        sign: { 
          sub: user.id 
        }
      }
    )

    const refreshToken = await reply.jwtSign(
      {
        role: user.role
      }, 
      {
        sign: { 
          sub: user.id, 
          expiresIn: '7d' 
        }
      }
    )

    return reply
      .setCookie('refreshToken', refreshToken, {
        path: '/',
        secure: true,
        httpOnly: true,
        sameSite: true,
      })
      .status(200)
      .send({
        token,
      })
  } catch (error) {
    console.log(error)
    if (error instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message : error.message })
    }
    return reply.status(500).send()
  }
}
