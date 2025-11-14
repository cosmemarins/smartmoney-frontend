import type { TipoComissaoEnum } from '@/utils/enums/TipoComissaoEnum'
import type { ClienteType } from './ClienteType'
import type { UsuarioType } from './UsuarioType'
import type { TipoExtratoEnum } from '@/utils/enums/TipoExtratoEnum'

export default interface ComissaoExtratoType {
  id?: number
  tipoComissao?: TipoComissaoEnum
  cliente?: ClienteType
  gestor?: UsuarioType
  perfilGestor?: string

  tipoDeposito?: TipoExtratoEnum
  valorDeposito?: number
  dataDeposito?: Date

  dataCreditoCliente?: Date
  dataCreditoGestor?: Date

  taxa?: number
  diasProrata?: number

  parcela?: number
  mesReferencia?: Date

  IR?: number
  valorIR?: number
  valorBruto?: number
  valorLiquido?: number
}

export type ComissaoExtratoTypeAction = ComissaoExtratoType & {
  action?: string
}
