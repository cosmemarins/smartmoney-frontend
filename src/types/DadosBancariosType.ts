// Typos para o objoto Cliente

import type { BancoType } from './BancoType'

export type DadosBancariosType = {
  id?: number //id do cliente
  token?: string
  banco?: BancoType
  agencia?: string
  conta?: string
  tipoConta?: string
  tipoPoupanca?: string
  tipoPix?: string
  chavePix?: string
}

export const dadosBancariosInit = {
  id: 0,
  token: '',
  banco: {
    codigo: '',
    nome: '',
    apelido: ''
  },
  agencia: '',
  conta: '',
  tipoConta: '',
  tipoPoupanca: '',
  tipoPix: '',
  chavePix: ''
}

export const tiposContaBancaria = ['Conta Corrente', 'Poupança']

export const tiposPix = ['CPF', 'CNPJ', 'Email', 'Celular', 'Random']
