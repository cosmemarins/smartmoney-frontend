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
}
