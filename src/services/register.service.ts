import bcrypt from 'bcryptjs'
import type { User } from '@prisma/client'
import { UsersRepositoryPort } from '@/repositories/users-repository.port'
import { UserEmailAlreadyExists } from '@/utils/errors/authenticate/user-email-already-exists.error'

interface RegisterServiceParams {
  name: string
  email: string
  password: string
}

interface RegisterServiceResponse{
  user: User
}

export class RegisterService {
  constructor(private usersRepository: UsersRepositoryPort) {}

  async execute({ email, name, password }: RegisterServiceParams): Promise<RegisterServiceResponse> {
    const passwordHash = await bcrypt.hash(password, 6)

    const existentUserEmail = await this.usersRepository.findByEmail(email)

    if (existentUserEmail) {
      throw new UserEmailAlreadyExists()
    }

    const newUser = await this.usersRepository.create({
      name,
      email,
      password: passwordHash,
    })

    return {
      user: newUser
    }
  }
}
