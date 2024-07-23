import { StatusContratoEnum } from '@/utils/enums/StatusContratoEnum'
import { ResumoExtratoInit, type ResumoExtratoType } from './ResumoExtratoType'

export type ResumoContratoType = {
  id: number
  token: string
  status: string
  podeEnviar: boolean
  podeAtivar: boolean
  aporteOk: boolean
  cartaoCnpjOk: boolean
  comprovanteResidenciaOk: boolean
  contratoSocialOk: boolean
  identidadeOk: boolean
  resumoExtrato?: ResumoExtratoType
}

export const ResumoContratoInit = {
  id: 0,
  token: '',
  status: StatusContratoEnum.NOVO,
  podeEnviar: false,
  podeAtivar: false,
  aporteOk: false,
  cartaoCnpjOk: false,
  comprovanteResidenciaOk: false,
  contratoSocialOk: false,
  identidadeOk: false,
  resumoExtrato: ResumoExtratoInit
}
