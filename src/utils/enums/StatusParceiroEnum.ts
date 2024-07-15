export enum StatusParceiroEnum {
  ATIVO = 'ATIVO',
  NOVO = 'NOVO',
  INATIVO = 'INATIVO',
  PENDENTE = 'PENDENTE'
}

export function getStatusParceiroEnumDesc(item: string | undefined) {
  switch (item) {
    case StatusParceiroEnum.ATIVO:
      return 'ativo'
    case StatusParceiroEnum.NOVO:
      return 'novo'
    case StatusParceiroEnum.INATIVO:
      return 'inativo'
    case StatusParceiroEnum.PENDENTE:
      return 'pendente'
    default:
      return ''
  }
}

export function getStatusParceiroolor(item: string) {
  switch (item) {
    case StatusParceiroEnum.ATIVO:
      return 'success'
    case StatusParceiroEnum.NOVO:
      return 'warning'
    case StatusParceiroEnum.INATIVO:
      return 'error'
    case StatusParceiroEnum.PENDENTE:
      return 'warning'
    default:
      return 'default'
  }
}

export const StausParceiroEnumList = [
  { value: 'ATIVO', label: 'Ativo' },
  { value: 'NOVO', label: 'Novo' },
  { value: 'INATIVO', label: 'Inativo' },
  { value: 'PENDENTE', label: 'Pendente' }
]
