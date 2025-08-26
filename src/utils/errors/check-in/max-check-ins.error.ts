export class MaxCheckinsError extends Error {
  constructor(){
    super('Não foi possivel realizar check-in')
  }
}