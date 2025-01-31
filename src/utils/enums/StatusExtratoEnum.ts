export enum StatusExtratoEnum {
  NOVO = 'NOVO',
  AGUARDANDO = 'AGUARDANDO',
  ATIVO = 'ATIVO'
}

export function getStatusExtratoEnumDesc(item: string | undefined) {
  switch (item) {
    case StatusExtratoEnum.NOVO:
      return 'novo'
    case StatusExtratoEnum.AGUARDANDO:
      return 'aguardando'
    case StatusExtratoEnum.ATIVO:
      return 'ativo'
    default:
      return ''
  }
}

export function getStatusExtratoEnumColor(item: string) {
  switch (item) {
    case StatusExtratoEnum.NOVO:
      return 'error'
    case StatusExtratoEnum.AGUARDANDO:
      return 'warning'
    case StatusExtratoEnum.ATIVO:
      return 'success'
    default:
      return 'default'
  }
}

export const StatusExtratoEnumList = [
  { value: 'NOVO', label: 'Novo' },
  { value: 'AGUARDANDO', label: 'Aguardando' },
  { value: 'ATIVO', label: 'Ativo' }
]
