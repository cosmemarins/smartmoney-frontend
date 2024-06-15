import type { ClienteType } from './ClienteType'
import type { UsuarioType } from './UsuarioType'

export type ArquivoType = {
  id?: number
  token?: string
  tipoUsuario?: string
  idUsuario?: number
  cliente?: ClienteType
  usuario?: UsuarioType
  tipoDocumento?: string
  nome?: string
  nomeOriginal?: string
  descricao?: string
  extArquivo?: string
  tamanho?: string
  contentType?: string
  data?: Date
  dataExclusao?: Date
}
