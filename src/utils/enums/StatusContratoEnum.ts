export enum StatusContratoEnum {
  NOVO = 'NOVO',
  AGUARDANDO = 'AGUARDANDO',
  ATIVO = 'ATIVO',
  SUBSTITUIDO = 'SUBSTITUIDO',
  CANCELADO = 'CANCELADO',
  FINALIZADO = 'FINALIZADO'
}

export function getStatusContratoEnumDesc(item: string | undefined) {
  switch (item) {
    case StatusContratoEnum.NOVO:
      return 'novo'
    case StatusContratoEnum.AGUARDANDO:
      return 'aguardando'
    case StatusContratoEnum.ATIVO:
      return 'ativo'
    case StatusContratoEnum.SUBSTITUIDO:
      return 'substituído'
    case StatusContratoEnum.CANCELADO:
      return 'cancelado'
    case StatusContratoEnum.FINALIZADO:
      return 'finalizado'
    default:
      return ''
  }
}

export function getStatusContratoEnumColor(item: string) {
  switch (item) {
    case StatusContratoEnum.NOVO:
      return 'error'
    case StatusContratoEnum.AGUARDANDO:
      return 'warning'
    case StatusContratoEnum.ATIVO:
      return 'success'
    case StatusContratoEnum.SUBSTITUIDO:
      return 'info'
    case StatusContratoEnum.CANCELADO:
      return 'error'
    case StatusContratoEnum.FINALIZADO:
      return 'secondary'
    default:
      return 'default'
  }
}
