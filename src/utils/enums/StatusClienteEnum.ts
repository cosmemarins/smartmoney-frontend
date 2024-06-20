export enum StatusClienteEnum {
  ATIVO = 'ATIVO',
  NOVO = 'NOVO',
  INATIVO = 'INATIVO',
  PENDENTE = 'PENDENTE'
}

export function getStatusClienteEnumDesc(item: string | undefined) {
  switch (item) {
    case StatusClienteEnum.ATIVO:
      return 'ativo'
    case StatusClienteEnum.NOVO:
      return 'novo'
    case StatusClienteEnum.INATIVO:
      return 'inativo'
    case StatusClienteEnum.PENDENTE:
      return 'pendente'
    default:
      return ''
  }
}

export function getStatusClienteEnumColor(item: string) {
  switch (item) {
    case StatusClienteEnum.ATIVO:
      return 'success'
    case StatusClienteEnum.NOVO:
      return 'warning'
    case StatusClienteEnum.INATIVO:
      return 'error'
    case StatusClienteEnum.PENDENTE:
      return 'warning'
    default:
      return 'default'
  }
}

export const StausClienteEnumList = [
  { value: 'ATIVO', label: 'Ativo' },
  { value: 'NOVO', label: 'Novo' },
  { value: 'INATIVO', label: 'Inativo' },
  { value: 'PENDENTE', label: 'Pendente' }
]
