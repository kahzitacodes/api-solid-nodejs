import { UsersRepository } from '@/repositories/users-repository'
import { hash } from 'bcryptjs'
import { UserEmailAlreadyExists } from './errors/users/user-email-already-exists.error'

interface RegisterServiceParams {
  name: string
  email: string
  password: string
}

export class RegisterService {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ email, name, password }: RegisterServiceParams) {
    const passwordHash = await hash(password, 6)

    const existentUserEmail = await this.usersRepository.findByEmail(email)

    if (existentUserEmail) {
      throw new UserEmailAlreadyExists()
    }

    await this.usersRepository.create({
      name,
      email,
      password: passwordHash,
    })
  }
}
