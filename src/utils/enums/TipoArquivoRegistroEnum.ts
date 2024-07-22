export enum TipoArquivoRegistroEnum {
  USUARIO = 'USUARIO',
  CLIENTE = 'CLIENTE',
  EXTRATO = 'EXTRATO',
  PARCEIRO = 'PARCEIRO'
}

export function getTipoArquivoRegistroEnumDesc(item: string) {
  switch (item) {
    case TipoArquivoRegistroEnum.USUARIO:
      return 'Usuário'
    case TipoArquivoRegistroEnum.CLIENTE:
      return 'Cliente'
    case TipoArquivoRegistroEnum.EXTRATO:
      return 'Extrato'
    case TipoArquivoRegistroEnum.PARCEIRO:
      return 'Parceiro'
    default:
      return ''
  }
}

export function getTipoArquivoRegistroEnumColor(item: string) {
  switch (item) {
    case TipoArquivoRegistroEnum.USUARIO:
      return 'success'
    case TipoArquivoRegistroEnum.CLIENTE:
      return 'success'
    case TipoArquivoRegistroEnum.EXTRATO:
      return 'success'
    case TipoArquivoRegistroEnum.PARCEIRO:
      return 'success'
    default:
      return 'default'
  }
}
