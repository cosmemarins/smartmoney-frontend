import type { TipoComissaoEnum } from '@/utils/enums/TipoComissaoEnum'
import type { ClienteType } from './ClienteType'
import type { UsuarioType } from './UsuarioType'

export default interface ComissaoAgrupadaType {
  id?: number
  mesReferencia?: Date
  tipoComissao?: TipoComissaoEnum
  cliente?: ClienteType
  gestor?: UsuarioType

  menorTaxa?: number
  maiorTaxa?: number
  taxaMedia?: number
  menorValor?: number
  maiorValor?: number
  valorMedio?: number
  dataCredito?: Date
  IRMedio?: number
  totalIR?: number
  totalBruto?: number
  totalLiquido?: number
  totalDepositos?: number

  qtdLancamentos?: number
}

export type ComissaoAgrupadaTypeAction = ComissaoAgrupadaType & {
  action?: string
}
