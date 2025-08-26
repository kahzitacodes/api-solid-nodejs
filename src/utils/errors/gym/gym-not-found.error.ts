export class GymNotFoundError extends Error {
  constructor(){
    super('Academia não encontrada')
  }
}