export class LateCheckInValidationError extends Error {
  constructor(){
    super('Check-in não pode ser validado após 20 minutos da sua criação')
  }
}