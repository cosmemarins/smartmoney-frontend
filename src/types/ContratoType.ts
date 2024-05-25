// Typos para o objoto Cliente

import type { ClienteType } from './ClienteType'

export type ContratoType = {
  id?: number
  token?: string
  cliente?: ClienteType
  contratoPai?: ContratoType
  data?: Date
  valor?: number
  prazo?: number
  taxa?: number
  status?: string
  observacao?: string
  dataEnvio?: Date
}

export const contratoInit = {
  data: new Date(),
  valor: 0,
  prazo: 12,
  taxa: 0,
  observacao: ''
}

export const prazoList = [12, 24, 36]
