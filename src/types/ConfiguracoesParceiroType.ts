// Typos para o objoto Cliente

export type ConfiguracoesParceiroType = {
  id?: number //id do cliente;
  token?: string
  taxaDistribuicao?: number
  podeCriarEquipe?: boolean
}

export const ConfiguracoesParceiroInit = {
  id: 0,
  token: '',
  taxaDistribuicao: 0,
  podeCriarEquipe: false
}
