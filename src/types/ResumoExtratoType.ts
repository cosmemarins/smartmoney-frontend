// Typos para o objoto Cliente

export type ResumoExtratoType = {
  id?: number
  token?: string
  qdtAditivos: number
  totalAditivos: number
  qtdAportes: number
  totalAportes: number
  qtdDividendos: number
  totalDividendos: number
  qtdRetirada: number
  totalRetirada: number
}

export const ResumoExtratoInit = {
  qdtAditivos: 0,
  totalAditivos: 0,
  qtdAportes: 0,
  totalAportes: 0,
  qtdDividendos: 0,
  totalDividendos: 0,
  qtdRetirada: 0,
  totalRetirada: 0
}
