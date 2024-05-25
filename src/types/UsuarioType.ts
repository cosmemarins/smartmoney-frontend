import type { BancoType } from './BancoType'
import type { StatusColorType } from './utilTypes'

export type UsuarioType = {
  id?: number
  token?: string
  email?: string
  senha?: string
  nome?: string
  dataNascimento?: string
  identidade?: string
  cpfCnpj?: string
  gestor?: UsuarioType
  telefone?: string
  cep?: string
  endereco?: string
  numero?: string
  complemento?: string
  bairro?: string
  cidade?: string
  estado?: string
  banco?: BancoType
  agencia?: string
  agenciaDv?: string
  conta?: string
  tipoConta?: string
  tipoPoupanca?: string
  tipoPix?: string
  chavePix?: string
  docIdentidade?: string
  compResidencia?: string
  compFinanceiro?: string
  foto?: string
  roles?: string
  status?: string
  data?: Date
  dataUltimoAcesso?: Date
  dataUltimaModificacao?: Date
}

export type UsuarioTypeWithAction = UsuarioType & {
  action?: string
}

export const usuarioStatusColors: StatusColorType = {
  ATIVO: 'success',
  PENDENTE: 'warning',
  INATIVO: 'secondary'
}
