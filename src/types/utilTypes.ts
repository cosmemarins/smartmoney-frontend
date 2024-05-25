import type { ThemeColor } from '@/@core/types'

export enum TipoContaEnum {
  CONTA_CORRENTE = 'conta corrente',
  POUPANCA = 'poupança'
}

export type SortType = 'asc' | 'desc' | undefined | null

export type DataOptionsType = {
  q?: string
  column?: string
  sort?: SortType
  page?: number
  limit?: number
}

export type TipoContaType = (typeof TipoContaEnum)[keyof typeof TipoContaEnum]

export type erroType = {
  msg?: string
  field?: string
}

export type ArquivoUploadType = {
  token?: string
  titulo?: string
  nomeArquivo?: string
  tipoUpload?: string
  base64Data?: any
}

export type DialogConfirmaType = {
  open: boolean
  titulo?: string
  texto?: any
  botaoConfirma?: string
  handleConfirma?: any
}

export type StatusColorType = {
  [key: string]: ThemeColor
}

export type PerfilPageHeaderType = {
  nome?: string
  local?: string
  foto?: string
  imagemCapa?: string
  clienteDesde?: string
  status?: string
}

export const perfilPageHeaderInit = {
  foto: '/images/avatars/nobody.png',
  imagemCapa: '/images/pages/profile-banner.png'
}
