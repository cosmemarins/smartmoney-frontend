export enum StatusUsuarioEnum {
  ATIVO = 'ATIVO',
  NOVO = 'NOVO',
  INATIVO = 'INATIVO',
  PENDENTE = 'PENDENTE'
}

export function getStatusUsuarioEnumDesc(item: string | undefined) {
  switch (item) {
    case StatusUsuarioEnum.ATIVO:
      return 'ativo'
    case StatusUsuarioEnum.NOVO:
      return 'novo'
    case StatusUsuarioEnum.INATIVO:
      return 'inativo'
    case StatusUsuarioEnum.PENDENTE:
      return 'pendente'
    default:
      return ''
  }
}

export function getStatusUsuarioEnumColor(item: string) {
  switch (item) {
    case StatusUsuarioEnum.ATIVO:
      return 'success'
    case StatusUsuarioEnum.NOVO:
      return 'warning'
    case StatusUsuarioEnum.INATIVO:
      return 'error'
    case StatusUsuarioEnum.PENDENTE:
      return 'warning'
    default:
      return 'default'
  }
}

export const StausUsuarioEnumList = [
  { value: 'ATIVO', label: 'Ativo' },
  { value: 'NOVO', label: 'Novo' },
  { value: 'INATIVO', label: 'Inativo' },
  { value: 'PENDENTE', label: 'Pendente' }
]
