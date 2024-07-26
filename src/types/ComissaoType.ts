export type ComissaoType = {
  id?: number
  token?: string
  cliente?: number
  tokenCliente?: string
  nomeCliente?: string
  gestor?: number
  tokenGestor?: string
  nomeGestor?: string
  parceiro?: number
  tokenParceiro?: string
  nomeParceiro?: string
  valor?: number
  saldo?: number
  prazo?: number
  taxaGestor?: number
  valorRepasseDiretor?: number
  taxaCliente?: number
  valorRepasseCliente?: number
  taxaParceiro?: number
  valorRepasseParceiro?: number
  taxaAgente?: number
  valorRepasseAgente?: number
  dataAporte?: Date
  dataCredito?: Date
  dataVencimento?: Date
}

export type ComissaoTypeAction = ComissaoType & {
  action?: string
}
