// Typos para o objoto Cliente

import { StatusContratoEnum } from '@/utils/enums/StatusContratoEnum'
import type { ClienteType } from './ClienteType'

export type ContratoType = {
  id?: number
  token?: string
  cliente?: ClienteType
  contratoPai?: ContratoType
  data?: Date
  valor?: number
  saldo?: number
  prazo?: number
  taxaCliente?: number
  taxaCredenciado?: number
  taxaGestor?: number
  taxaAgente?: number
  taxaOutros?: number
  taxaCcb?: number
  status?: string
  observacao?: string
  dataEnvio?: Date
}

export const contratoInit = {
  data: new Date(),
  valor: 0,
  saldo: 0,
  prazo: 12,
  taxaCliente: 0,
  taxaCredenciado: 1,
  taxaGestor: 0,
  taxaAgente: 0,
  taxaOutros: 0,
  taxaCcb: 0,
  status: StatusContratoEnum.NOVO,
  observacao: ''
}

export type ContratoTypeWithAction = ContratoType & {
  action?: string
}

export const prazoList = [12, 24, 36]

export const taxaContratoMarks = [
  {
    value: 0,
    label: '0'
  },
  {
    value: 0.5,
    label: '0,5%'
  },
  {
    value: 1,
    label: '1%'
  },
  {
    value: 1.5,
    label: '1,5%'
  },
  {
    value: 2,
    label: '2%'
  },
  {
    value: 2.5,
    label: '1,5%'
  },
  {
    value: 3,
    label: '3%'
  },
  {
    value: 3.5,
    label: '3,5%'
  },
  {
    value: 4,
    label: '4%'
  },
  {
    value: 4.5,
    label: '4,5%'
  },
  {
    value: 5,
    label: '5%'
  }
]
