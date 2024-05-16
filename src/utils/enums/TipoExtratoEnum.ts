export enum TipoExtratoEnum {
  ADITIVO = 'ADITIVO',
  APORTE = 'APORTE',
  DIVIDENDO = 'DIVIDENDO',
  RETIRADA = 'RETIRADA'
}

export function getTipoExtratoEnumDesc(item: string) {
  switch (item) {
    case TipoExtratoEnum.ADITIVO:
      return 'aditivo'
    case TipoExtratoEnum.APORTE:
      return 'aporte'
    case TipoExtratoEnum.DIVIDENDO:
      return 'dividendo'
    case TipoExtratoEnum.RETIRADA:
      return 'retirada'
    default:
      return ''
  }
}

export function getTipoExtratoEnumColor(item: string) {
  switch (item) {
    case TipoExtratoEnum.ADITIVO:
      return 'success'
    case TipoExtratoEnum.APORTE:
      return 'success'
    case TipoExtratoEnum.DIVIDENDO:
      return 'success'
    case TipoExtratoEnum.RETIRADA:
      return 'error'
    default:
      return 'default'
  }
}

export const TipoExtratoEnumList = [
  { value: 'ADITIVO', label: 'Aditivo' },
  { value: 'APORTE', label: 'Aporte' },
  { value: 'DIVIDENDO', label: 'Dividendo' },
  { value: 'RETIRADA', label: 'Retirada' }
]
