import type { TipoExtratoEnum } from '@/utils/enums/TipoExtratoEnum'
import type { ComissaoProrataType } from './ComissaoProrataType'
import type { ContratoType } from './ContratoType'
import type { ExtratoType } from './ExtratoType'
import type { ClienteType } from './ClienteType'
import type { UsuarioType } from './UsuarioType'

export type ComissaoType = {
  id?: number
  contrato?: ContratoType
  extrato?: ExtratoType
  parcela?: number
  dataParcela?: Date
  valorReferencia?: number
  tipoExtrato?: TipoExtratoEnum

  cliente?: ClienteType
  taxaCliente?: number
  diasProrataCliente?: number
  valorCliente?: number
  dataCreditoCliente?: Date
  IRCliente?: number
  valorIRCliente?: number

  gestor?: UsuarioType
  perfilGestor?: string
  taxaGestor?: number
  valorGestor?: number
  IRGestor?: number
  valorIRGestor?: number

  parceiro1?: UsuarioType
  perfilParceiro1?: string
  taxaParceiro1?: number
  valorParceiro1?: number
  IRParceiro1?: number
  valorIRParceiro1?: number

  parceiro2?: UsuarioType
  perfilParceiro2?: string
  taxaParceiro2?: number
  valorParceiro2?: number
  IRParceiro2?: number
  valorIRParceiro2?: number

  parceiro3?: UsuarioType
  perfilParceiro3?: string
  taxaParceiro3?: number
  valorParceiro3?: number
  IRParceiro3?: number
  valorIRParceiro3?: number

  master?: UsuarioType
  taxaMaster?: number
  valorMaster?: number
  IRMaster?: number
  valorIRMaster?: number

  taxaCredenciado?: number
  valorCredenciado?: number

  taxaOutros?: number
  valorOutros?: number

  taxaCcb?: number
  valorCcb?: number

  diasProrataEquipe?: number
  dataCreditoEquipe?: Date

  data?: Date
  dataUltimaModificacao?: Date

  //DEPRECATED
  proratas?: ComissaoProrataType[]
  nomeGestor?: string
  nomeParceiro1?: string
  nomeParceiro2?: string
  nomeParceiro3?: string
  nomeCliente?: string
  dataAporte?: Date
  dataCredito?: Date
  dataVencimento?: Date
  saldo?: number
  valor?: number
  valorRepasse?: number
  valorRepasseGestor?: number
  taxa?: number
}

export type ComissaoTypeAction = ComissaoType & {
  action?: string
}
