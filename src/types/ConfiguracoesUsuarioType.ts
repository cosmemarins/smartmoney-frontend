// Typos para o objoto Cliente

export type ConfiguracoesUsuarioType = {
  id?: number //id do cliente
  token?: string
  taxaDistribuicao?: number
}

export const ConfiguracoesUsuarioInit = {
  id: 0,
  token: '',
  taxaDistribuicao: 0
}