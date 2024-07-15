import type { BancoType } from './BancoType'
import type { UsuarioType } from './UsuarioType'
import type { StatusColorType } from './utilTypes'

export type ParceiroType = {
  id?: number
  token?: string
  gestor?: ParceiroType
  nomeFantasia?: string
  razaoSocial?: string
  cnpj?: string
  inscricaoEstadual?: string
  dataAbertura?: Date
  socioResponsavel?: UsuarioType
  email?: string
  telefone?: string
  endereco?: string
  numero?: string
  complemento?: string
  bairro?: string
  cidade?: string
  estado?: string
  cep?: string
  banco?: BancoType
  agencia?: string
  agenciaDv?: string
  conta?: string
  tipoConta?: string
  tipoPoupanca?: string
  tipoPix?: string
  chavePix?: string
  taxaDistribuicao?: number
  podeCriarEquipe?: boolean
  status?: string
  dataUltimaModificacao?: Date
  data?: Date
}

export type ParceiroTypeWithAction = ParceiroType & {
  action?: string
}

export const parceiroStatusColors: StatusColorType = {
  ATIVO: 'success',
  NOVO: 'secondary',
  INATIVO: 'secondary',
  PENDENTE: 'warning'
}
