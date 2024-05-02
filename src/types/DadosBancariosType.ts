// Typos para o objoto Cliente

import type { BancoType } from './BancoType'

export type DadosBancariosType = {
  idCliente?: number
  banco?: BancoType
  agencia?: string
  conta?: string
  tipoConta?: string
  tipoPoupanca?: string
  tipoPix?: string
  chavePix?: string
}

export const dadosBancariosInit = {
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

export const tiposPix = ['CPF', 'CNPJ', 'Email', 'Celular', 'Chave aleatória']
