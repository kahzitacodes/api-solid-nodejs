import { prisma } from '@/lib/prisma'
import { Prisma, User } from '@prisma/client'
import { UsersRepositoryPort } from '../users-repository.port'

export class InMemoryUsersRepository implements UsersRepositoryPort{
  public users: User[] = []

  async create(data: Prisma.UserCreateInput) {
    const user: User = {
      id: 'user-1',
      name: data.name,
      email: data.email,
      password: data.password,
      created_at: new Date(),
    }

    this.users.push(user)

    return user
  }

  async findByEmail(email: string) {
    return this.users.find(user => user.email === email) || null
  }

  async findById(id: string) {
    return this.users.find(user => user.id === id) || null
  }
}
