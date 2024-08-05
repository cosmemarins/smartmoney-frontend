export enum PerfilUsuarioEnum {
  MASTER = 'MASTER',
  PARCEIRO = 'PARCEIRO',
  AGENTE = 'AGENTE',
  SOCIO = 'SOCIO',
  ADMINISTRATIVO = 'ADMINISTRATIVO',
  FINANCEIRO = 'FINANCEIRO',
  JURIDICO = 'JURIDICO',
  OUTROS = 'OUTROS'
}

export function getPerfilUsuarioEnumDesc(item: string | undefined) {
  switch (item) {
    case PerfilUsuarioEnum.MASTER:
      return 'Master'
    case PerfilUsuarioEnum.PARCEIRO:
      return 'Parceiro'
    case PerfilUsuarioEnum.AGENTE:
      return 'Agente'
    case PerfilUsuarioEnum.SOCIO:
      return 'Sócio'
    case PerfilUsuarioEnum.ADMINISTRATIVO:
      return 'Administrativo'
    case PerfilUsuarioEnum.FINANCEIRO:
      return 'Financeiro'
    case PerfilUsuarioEnum.JURIDICO:
      return 'Jurídico'
    case PerfilUsuarioEnum.OUTROS:
      return 'Colaborador'
    default:
      return ''
  }
}

export function getPerfilUsuarioEnumColor(item: string) {
  switch (item) {
    case PerfilUsuarioEnum.MASTER:
      return 'warning'
    case PerfilUsuarioEnum.PARCEIRO:
      return 'warning'
    case PerfilUsuarioEnum.AGENTE:
      return 'warning'
    case PerfilUsuarioEnum.SOCIO:
      return 'success'
    case PerfilUsuarioEnum.ADMINISTRATIVO:
      return 'default'
    case PerfilUsuarioEnum.FINANCEIRO:
      return 'default'
    case PerfilUsuarioEnum.JURIDICO:
      return 'default'
    case PerfilUsuarioEnum.OUTROS:
      return 'default'
    default:
      return 'default'
  }
}

export const PerfilUsuarioEnumList = [
  //{ value: 'AGENTE', label: 'Agente' },
  //{ value: 'SOCIO', label: 'Sócio' },
  //{ value: 'MASTER', label: 'Master' },
  //{ value: 'PARCEIRO', label: 'Parceiro' },
  { value: 'ADMINISTRATIVO', label: 'Adminsitrativo' },
  { value: 'FINANCEIRO', label: 'Financeiro' },
  { value: 'JURIDICO', label: 'Jurídico' },
  { value: 'OUTROS', label: 'Outros' }
]
