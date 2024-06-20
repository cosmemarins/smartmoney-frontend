export enum TipoDocumentoEnum {
  ADITIVO = 'ADITIVO',
  APORTE = 'APORTE',
  COMPROVANTE_RESIDENCIA = 'COMPROVANTE_RESIDENCIA',
  COMPROVANTE_FINANCEIRO = 'COMPROVANTE_FINANCEIRO',
  IDENTIDADE = 'IDENTIDADE',
  OUTROS = 'OUTROS'
}

export function getTipoDocumentoEnumDesc(item: TipoDocumentoEnum) {
  switch (item) {
    case TipoDocumentoEnum.ADITIVO:
      return 'Aditivo'
    case TipoDocumentoEnum.APORTE:
      return 'Comprovante de transferência'
    case TipoDocumentoEnum.IDENTIDADE:
      return 'Identidade'
    case TipoDocumentoEnum.COMPROVANTE_RESIDENCIA:
      return 'Comprovante de residência'
    case TipoDocumentoEnum.COMPROVANTE_FINANCEIRO:
      return 'Comprovante financeiro'
    case TipoDocumentoEnum.OUTROS:
      return 'Outros'
    default:
      return ''
  }
}

export const TipoDocumentoEnumList = [
  { value: 'ADITIVO', label: 'Aditivo' },
  { value: 'APORTE', label: 'Comprovante de transferência' },
  { value: 'COMPROVANTE_RESIDENCIA', label: 'Comprovante de residência' },

  //{ value: 'COMPROVANTE_FINANCEIRO', label: 'Comprovante financeiro' },
  { value: 'IDENTIDADE', label: 'Identidade' },
  { value: 'OUTROS', label: 'Outros' }
]
