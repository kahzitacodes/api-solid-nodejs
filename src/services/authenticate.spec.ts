import * as bcrypt from 'bcryptjs'
import { describe, beforeEach, expect, it } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { InvalidCredentialsError } from '@/utils/errors'
import { AuthenticateService } from './authenticate.service'

describe('Authenticate service', () => {
  let usersRepository: InMemoryUsersRepository
  let sut: AuthenticateService

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new AuthenticateService(usersRepository)
  })

  it('should authenticate a user with valid credentials', async () => {
    await usersRepository.create({
      name: 'Jane Doe',
      email: 'jane.doe@email.com',
      password: await bcrypt.hash('123456', 6)
    })

    const {user} = await sut.execute({
      email: 'jane.doe@email.com',
      password: '123456'
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should throw an error for invalid email', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const sut = new AuthenticateService(usersRepository)

     expect(() => sut.execute({
      email: 'invalid.email.com',
      password: '123456'
    })).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should throw an error for invalid password', async () => {
    await usersRepository.create({
      name: 'Jane Doe',
      email: 'jane.doe@email.com',
      password: await bcrypt.hash('123456', 6)
    })

     expect(() => sut.execute({
      email: 'invalid.email.com',
      password: '654321'
    })).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})