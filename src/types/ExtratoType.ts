// Typos para o objoto Cliente

import type { ContratoType } from './ContratoType'

export type ExtratoType = {
  contrato: ContratoType
  id?: number
  token?: string
  data?: Date
  tipo?: string
  historico?: string
  valor?: number
  compDeposito?: string
}

export const ExtratoInit = {
  data: new Date(),
  valor: 0,
  prazo: 12
}
