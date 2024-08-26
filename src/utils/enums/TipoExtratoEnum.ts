export enum TipoExtratoEnum {
  ADITIVO = 'ADITIVO',
  APORTE = 'APORTE',
  DIVIDENDO = 'DIVIDENDO',
  RETIRADA = 'RETIRADA',
  RESGATE = 'RESGATE',
  TAXA = 'TAXA'
}

export function getTipoExtratoEnumDesc(item: string) {
  switch (item) {
    case TipoExtratoEnum.ADITIVO:
      return 'Aditivo'
    case TipoExtratoEnum.APORTE:
      return 'Aporte'
    case TipoExtratoEnum.DIVIDENDO:
      return 'Dividendo'
    case TipoExtratoEnum.RETIRADA:
      return 'Retirada'
    case TipoExtratoEnum.RESGATE:
      return 'Resgate'
    case TipoExtratoEnum.TAXA:
      return 'Taxa'
    default:
      return ''
  }
}

export function getTipoExtratoEnumColor(item: string) {
  switch (item) {
    case TipoExtratoEnum.ADITIVO:
    case TipoExtratoEnum.APORTE:
    case TipoExtratoEnum.DIVIDENDO:
      return 'success'
    case TipoExtratoEnum.RETIRADA:
    case TipoExtratoEnum.RESGATE:
    case TipoExtratoEnum.TAXA:
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
