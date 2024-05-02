import type { DataOptionsType } from 'src/types/UtilTypes'

import api from './api'
import type { UsuarioType } from '../types/UsuarioType'

const path = 'usuarios'

async function getList(usuario: UsuarioType, dataOptions?: DataOptionsType): Promise<UsuarioType[]> {
  const queryString = new URLSearchParams()

  Object.entries(usuario ?? {}).map(prop => queryString.append(prop[0], `${prop[1]}`))

  Object.entries(dataOptions ?? {}).map(prop => queryString.append(prop[0], `${prop[1]}`))

  const { data } = await api.get<UsuarioType[]>(`${path}/?${queryString.toString()}`)

  console.log('getdata', data)

  return data
}

async function incluirUsuario(usuario: UsuarioType): Promise<UsuarioType> {
  const { data } = await api.post<UsuarioType>(path, usuario)

  return data
}

async function editarUsuario(usuario: UsuarioType, isProfile = false): Promise<UsuarioType> {
  console.log(`${path}${isProfile ? '/profile' : ''}`)
  const { data } = await api.put<UsuarioType>(`${path}${isProfile ? '/profile' : ''}`, usuario)

  return data
}

async function excluirUsuario(id: number): Promise<void | undefined> {
  await api.delete(`${path}/${id}`)
}

interface UserData {
  email: string
  company: string
  billing: string
  country: string
  contact: number
  fullName: string
  username: string
}

async function convidarCliente(usuario: UserData): Promise<UsuarioType> {
  const { data } = await api.post<UsuarioType>(path, usuario)

  return data
}

export default { getList, incluirUsuario, editarUsuario, excluirUsuario, convidarCliente }
