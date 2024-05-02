import api from './api'
import type { ClienteType } from '@/types/ClienteType'
import type { DataOptionsType } from '@/types/utilTypes'

const path = 'clientes'

async function getList(cliente: ClienteType, dataOptions?: DataOptionsType): Promise<ClienteType[]> {
  const queryString = new URLSearchParams()

  Object.entries(cliente ?? {}).map(prop => queryString.append(prop[0], `${prop[1]}`))

  Object.entries(dataOptions ?? {}).map(prop => queryString.append(prop[0], `${prop[1]}`))

  const { data } = await api.get<ClienteType[]>(`${path}/?${queryString.toString()}`)

  console.log('getdata', data)

  return data
}

async function incluir(cliente: ClienteType): Promise<ClienteType> {
  const { data } = await api.post<ClienteType>(path, cliente)

  return data
}

async function editar(cliente: ClienteType, isProfile = false): Promise<ClienteType> {
  console.log(`${path}${isProfile ? '/profile' : ''}`)
  const { data } = await api.put<ClienteType>(`${path}${isProfile ? '/profile' : ''}`, cliente)

  return data
}

async function excluir(id: number): Promise<void | undefined> {
  await api.delete(`${path}/${id}`)
}

export { getList, incluir, editar, excluir }
