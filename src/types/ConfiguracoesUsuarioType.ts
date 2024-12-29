// Typos para o objoto Cliente

export type ConfiguracoesUsuarioType = {
  id?: number //id do cliente
  token?: string
  taxaDistribuicao?: number
  percentualFixo?: number
  faixasDistribuicao?: string
  podeCriarEquipe?: boolean
  perfil?: string
}

export const ConfiguracoesUsuarioInit = {
  id: 0,
  token: '',
  taxaDistribuicao: 0,
  percentualFixo: 0,
  faixasDistribuicao: '2|10000',
  podeCriarEquipe: false
}
