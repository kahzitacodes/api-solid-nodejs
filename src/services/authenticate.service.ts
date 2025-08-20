import { UsersRepositoryPort } from '@/repositories/users-repository.port'
import { InvalidCredentialsError } from '@/utils/errors/authenticate/invalid-crendentials.error'
import bcrypt from 'bcryptjs'

interface AuthenticateServiceRequest {
  email: string
  password: string
}

interface AuthenticateServiceResponse {
  user: {
    id: string
    email: string
    name: string
  }
}

export class AuthenticateService {
  constructor(private usersRepository: UsersRepositoryPort) {}

  async execute({ email, password }: AuthenticateServiceRequest): Promise<AuthenticateServiceResponse> {
    const user = await this.usersRepository.findByEmail(email)

    if (!user) {
      throw new InvalidCredentialsError()
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      throw new InvalidCredentialsError()
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      }
    }
  }
}