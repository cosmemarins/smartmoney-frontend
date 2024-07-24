export type ComissionamentoType = {
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
  valorRepasse?: number
  prazo?: number
  taxaCliente?: number
  taxaParceiro?: number
  taxaAgente?: number
  dataAporte?: Date
  dataCredito?: Date
  dataVencimento?: Date
}

export type ComissionamentoTypeAction = ComissionamentoType & {
  action?: string
}
