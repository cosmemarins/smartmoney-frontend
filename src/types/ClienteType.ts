// Typos para o objoto Cliente

import type { BancoType } from './BancoType'
import type { UsuarioType } from './UsuarioType'

export type ClienteType = {
  id: number
  nome?: string
  dataNascimento?: string
  identidade?: string
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
  status?: string
  data?: Date
  dataUltimaModificacao?: Date
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

export type ClienteProfileHeaderType = {
  nome: string
  local?: string
  foto?: string
  imagemCapa?: string
  clienteDesde?: string
  status?: string
}

export const ClienteInit = {
  id: 0,
  nome: '',
  dataNascimento: '',
  identidade: '',
  cpfCnpj: '',
  email: '',
  telefone: '',
  cep: '',
  endereco: '',
  numero: '',
  complemento: '',
  bairro: '',
  cidade: '',
  estado: '',
  status: ''
}
