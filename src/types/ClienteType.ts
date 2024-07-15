// Typos para o objoto Cliente

import type { BancoType } from './BancoType'
import type { UsuarioType } from './UsuarioType'
import type { StatusColorType } from './utilTypes'

export type ClienteType = {
  id?: number
  token?: string
  nome?: string
  razaoSocial?: string
  nomeSocio?: string
  dataNascimento?: string
  identidade?: string
  tipoPessoa?: string
  cpfCnpj?: string
  email?: string
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
  conta?: string
  tipoConta?: string
  tipoPoupanca?: string
  tipoPix?: string
  chavePix?: string
  docIdentidade?: string
  compResidencia?: string
  compFinanceiro?: string
  foto?: string
  status?: string
  data?: Date
  dataUltimaModificacao?: Date
}

export type ClienteTypeWithAction = ClienteType & {
  action?: string
}

export type IdentificacaoType = {
  nome?: string
  dataNascimento?: string
  identidade?: string
  cpfCnpj?: string
  email?: string
  telefone?: string
  cep?: string
  endereco?: string
  numero?: string
  complemento?: string
  bairro?: string
  cidade?: string
  estado?: string
  status?: string
}

export type ClienteDocumentacaoType = {
  token: string
  docIdentidade?: string
  compResidencia?: string
  compFinanceiro?: string
}

export const clienteDocumentacaoInit = {
  token: '',
  docIdentidade: '',
  compResidencia: '',
  compFinanceiro: ''
}

export const clienteStatusColors: StatusColorType = {
  ATIVO: 'success',
  NOVO: 'warning',
  INATIVO: 'secondary',
  PENDENTE: 'warning'
}
