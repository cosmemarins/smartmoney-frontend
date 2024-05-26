'use client'

import api from '@/services/api'
import type { UsuarioType } from '@/types/UsuarioType'
import type { DadosBancariosType } from '@/types/DadosBancariosType'
import type { DataOptionsType } from '@/types/utilTypes'
import { TipoDocumentoEnum } from '@/utils/enums/TipoDocumentoEnum'
import type UsuarioSenhaDTO from '@/types/UsuarioSenha.dto'

const path = 'usuarios'

async function getListUsuario(dataOptions?: DataOptionsType): Promise<UsuarioType[]> {
  const queryString = new URLSearchParams()

  //Object.entries(usuario ?? {}).map(prop => queryString.append(prop[0], `${prop[1]}`))

  Object.entries(dataOptions ?? {}).map(prop => queryString.append(prop[0], `${prop[1]}`))

  const { data } = await api.get<UsuarioType[]>(`${path}/?${queryString.toString()}`)

  //console.log('getList', data)

  return data
}

async function getUsuario(token: string): Promise<UsuarioType> {
  const { data } = await api.get<UsuarioType>(`${path}/${token}`)

  return data
}

async function salvarUsuario(usuario: UsuarioType): Promise<UsuarioType> {
  //console.log('incluirUsuario', usuario)

  const { data } =
    usuario.token && usuario.token != ''
      ? await api.put<UsuarioType>(path, usuario)
      : await api.post<UsuarioType>(path, usuario)

  return data
}

async function salvarDadosBancarios(dadosBancarios: DadosBancariosType): Promise<DadosBancariosType> {
  console.log('salvarDadosBancarios', dadosBancarios)

  const { data } = await api.put<DadosBancariosType>(path, dadosBancarios)

  return data
}

async function excluirUsuario(token: string): Promise<void | undefined> {
  await api.delete(`${path}/${token}`)
}

async function uploadDocumento(formData: any): Promise<UsuarioType> {
  const { data } = await api.post<UsuarioType>(`${path}/upload`, formData)

  //console.log('return data', data)

  return data
}

async function getThumbnailUsuario(token: string, tipoDocumento: TipoDocumentoEnum) {
  //console.log('Excluindo o extrato: ', token)
  let tipo

  switch (tipoDocumento) {
    case TipoDocumentoEnum.IDENTIDADE:
      tipo = 'identidade'
      break
    case TipoDocumentoEnum.COMPROVANTE_FINANCEIRO:
      tipo = 'comp-financeiro'
      break
    case TipoDocumentoEnum.COMPROVANTE_RESIDENCIA:
      tipo = 'comp-residencia'
      break
  }

  const response = await api.get(`${path}/thumb/${tipo}/${token}`, {
    responseType: 'arraybuffer'
  })

  //.then(response => {
  //  return Buffer.from(response.data, 'binary').toString('base64')
  //})
  return Buffer.from(response.data, 'binary').toString('base64')
}

async function salvarSenha(token: string, usuarioSenha: UsuarioSenhaDTO): Promise<DadosBancariosType> {
  const { data } = await api.post<DadosBancariosType>(`${path}/salvar-senha/${token}`, usuarioSenha)

  return data
}

async function resetarSenha(token: string, usuarioSenha: UsuarioSenhaDTO): Promise<DadosBancariosType> {
  const { data } = await api.put<DadosBancariosType>(`${path}/resetar-senha/${token}`, usuarioSenha)

  return data
}

export {
  getListUsuario,
  getUsuario,
  salvarUsuario,
  salvarDadosBancarios,
  excluirUsuario,
  uploadDocumento,
  getThumbnailUsuario,
  salvarSenha,
  resetarSenha
}
