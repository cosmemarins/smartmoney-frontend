export type ComissaoType = {
  id?: number
  token?: string
  cliente?: number
  tokenCliente?: string
  nomeCliente?: string
  gestor?: number
  perfilGestor?: string
  tokenGestor?: string
  nomeGestor?: string
  parceiro1?: number
  perfilParceiro1?: string
  tokenParceiro1?: string
  nomeParceiro1?: string
  parceiro2?: number
  perfilParceiro2?: string
  tokenParceiro2?: string
  nomeParceiro2?: string
  parceiro3?: number
  perfilParceiro3?: string
  tokenParceiro3?: string
  nomeParceiro3?: string
  master?: number
  tokenMaster?: string
  nomeMaster?: string
  valor?: number
  saldo?: number
  prazo?: number
  taxaCliente?: number
  valorRepasseCliente?: number
  taxaGestor?: number
  valorRepasseGestor?: number
  taxaParceiro1?: number
  valorRepasseParceiro1?: number
  taxaParceiro2?: number
  valorRepasseParceiro2?: number
  taxaParceiro3?: number
  valorRepasseParceiro3?: number
  taxaMaster?: number
  valorRepasseMaster?: number

  //valores só de retorno
  taxa?: number
  valorRepasse?: number

  dataAporte?: Date
  dataCredito?: Date
  dataVencimento?: Date
}

export type ComissaoTypeAction = ComissaoType & {
  action?: string
}
