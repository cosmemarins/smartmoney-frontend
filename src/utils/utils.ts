import type UsuarioPayloadDTO from '@/types/UsuarioPayload.dto'
import { PerfilUsuarioEnum } from './enums/PerfilUsuarioEnum'

export const isPerfilColaborador = (perfil: string): boolean => {
  const retorno =
    perfil != PerfilUsuarioEnum.MASTER && perfil != PerfilUsuarioEnum.AGENTE && perfil != PerfilUsuarioEnum.PARCEIRO

  return retorno
}

export const isColaboradorMaster = (usuarioPayload?: UsuarioPayloadDTO): boolean => {
  if (!usuarioPayload) return false

  const retorno = isPerfilColaborador(usuarioPayload.perfil) && usuarioPayload.idGestor === 1

  return retorno
}

export const isMaster = (usuarioPayload?: UsuarioPayloadDTO): boolean => {
  if (!usuarioPayload) return false

  const retorno = usuarioPayload.idGestor === 1 || isColaboradorMaster(usuarioPayload)

  return retorno
}
