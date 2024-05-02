import type { BancoType } from './BancoType'

export type UsuarioType = {
  id: number
  email: string
  senha: string
  nome: string
  token: string
  cpfCnpj: string
  telefone: string
  endereco: string
  numero: string
  complemento: string
  bairro: string
  cidade: string
  estado: string
  cep: string
  banco: BancoType
  agencia: string
  agenciaDv: string
  conta: string
  contaDv: string
  tipoConta: string
  tipoPoupanca: string
  tipoPix: string
  chavePix: string
  status: string
  dataUltimoAcesso: Date
  gestor: UsuarioType
  role: string
}

export type UsuarioProfileHeaderType = {
  nome: string
  local: string
  foto: string
  clienteDesde: string
  imagemCapa: string
  status: string
}
