// Typos para o objoto Cliente

import { StatusContratoEnum } from '@/utils/enums/StatusContratoEnum'
import type { ArquivoType } from './ArquivoType'
import type { ContratoType } from './ContratoType'
import type FilterOptions from './FilterOptions'

export type ExtratoType = {
  contrato?: ContratoType
  id?: number
  token?: string
  data?: Date
  tipo?: string
  historico?: string
  valor?: number
  status?: string
  compDeposito?: string
  arquivo?: ArquivoType
}

export const ExtratoInit = {
  data: new Date(),
  valor: 0,
  status: StatusContratoEnum.NOVO,
  prazo: 12
}

export type ExtratoTypeWithAction = ExtratoType & {
  tipoExtrato: string
  action?: string
}

export type ExtratoFilterType = ExtratoType & {
  agente?: number
  cliente?: number
  tipoStatus?: string
  tipoExtrato?: string
  options?: FilterOptions
}
