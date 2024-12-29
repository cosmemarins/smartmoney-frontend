export enum TipoPercentualEnum {
  VARIAVEL = 'VARIAVEL',
  FIXO = 'FIXO'
}

export function getTipoPercentualEnumDesc(item: string | undefined) {
  switch (item) {
    case TipoPercentualEnum.VARIAVEL:
      return 'Variável'
    case TipoPercentualEnum.FIXO:
      return 'Fixo'
    default:
      return ''
  }
}

export function getTipoPercentualEnumColor(item: string) {
  switch (item) {
    case TipoPercentualEnum.VARIAVEL:
      return 'warning'
    case TipoPercentualEnum.FIXO:
      return 'default'
    default:
      return 'default'
  }
}

export const TipoPercentualEnumList = [
  { value: 'VARIAVEL', label: 'Variável' },
  { value: 'FIXO', label: 'Fixo' }
]
