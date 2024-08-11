import { StatusUsuarioEnum } from '@/utils/enums/StatusUsuarioEnum'

export type ResumoUsuarioType = {
  id: number
  token: string
  status: string
  podeAtivar: boolean
  identidadeOk: boolean
  comprovanteResidenciaOk: boolean
  cartaoCnpjOk: boolean
  contratoSocialOk: boolean
}

export const ResumoUsuarioInit = {
  id: 0,
  token: '',
  status: StatusUsuarioEnum.NOVO,
  podeAtivar: false,
  identidadeOk: false,
  comprovanteResidenciaOk: false,
  cartaoCnpjOk: false,
  contratoSocialOk: false
}
