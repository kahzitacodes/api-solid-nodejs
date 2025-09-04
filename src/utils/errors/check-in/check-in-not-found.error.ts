export class CheckInNotFoundError extends Error {
  constructor(){
    super('Check-in não encontrado')
  }
}