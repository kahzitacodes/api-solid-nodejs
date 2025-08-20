export class UserEmailAlreadyExists extends Error {
  constructor(){
    super('Já existe um usuário cadastrado com este e-mail')
  }
}