import type { BancoType } from './BancoType'
import type { StatusColorType } from './utilTypes'

export type UsuarioType = {
  id?: number
  token?: string
  gestor?: UsuarioType
  tipoPessoa?: string
  cpfCnpj?: string
  nome?: string
  dataNascimento?: string
  identidade?: string
  razaoSocial?: string
  nomeSocio?: string
  inscricaoEstadual?: string
  email?: string
  senha?: string
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
  foto?: string
  status?: string
  isAdmin?: boolean
  podeCriarEquipe?: boolean
  taxaDistribuicao?: number
  faixasDistribuicao?: string
  roles?: string
  perfil?: string
  dataUltimoAcesso?: Date
  dataUltimaModificacao?: Date
  dataSenha?: Date
  data?: Date
}

export type UsuarioTypeWithAction = UsuarioType & {
  action?: string
}

export const usuarioStatusColors: StatusColorType = {
  ATIVO: 'success',
  NOVO: 'secondary',
  INATIVO: 'secondary',
  PENDENTE: 'warning'
}
