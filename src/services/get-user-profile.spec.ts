import * as bcrypt from 'bcryptjs'
import { describe, beforeEach, expect, it } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { GetUserProfileService } from './get-user-profile.service'

describe('GetUserProfile service', () => {
  let usersRepository: InMemoryUsersRepository
  let sut: GetUserProfileService

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new GetUserProfileService(usersRepository)
  })

  it('should get user profile', async () => {
    const newUser = await usersRepository.create({
      name: 'Jane Doe',
      email: 'jane.doe@email.com',
      password: await bcrypt.hash('123456', 6)
    })

    const { user } = await sut.execute({
      userId: newUser.id
    })

    expect(user.id).toEqual(expect.any(String))
    expect(user.name).toEqual("Jane Doe")
  })
})