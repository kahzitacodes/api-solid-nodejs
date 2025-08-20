import { UsersRepositoryPort } from '@/repositories/users-repository.port'
import { InvalidCredentialsError, UserNotFoundError } from '@/utils/errors'

interface GetUserProfileServiceRequest {
  userId: string
}

interface GetUserProfileServiceResponse {
  user: {
    id: string
    email: string
    name: string
  }
}

export class GetUserProfileService {
  constructor(private usersRepository: UsersRepositoryPort) {}

  async execute({ userId }: GetUserProfileServiceRequest): Promise<GetUserProfileServiceResponse> {
    const user = await this.usersRepository.findById(userId)
    
    if (!user) {
      throw new UserNotFoundError()
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