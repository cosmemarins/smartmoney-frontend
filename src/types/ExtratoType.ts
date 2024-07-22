// Typos para o objoto Cliente

import type { ArquivoType } from './ArquivoType'
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
  arquivo?: ArquivoType
}

export const ExtratoInit = {
  data: new Date(),
  valor: 0,
  prazo: 12
}
