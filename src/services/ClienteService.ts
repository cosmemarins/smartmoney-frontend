'use client'

import api from './api'
import type { ClienteType } from '@/types/ClienteType'
import type { DadosBancariosType } from '@/types/DadosBancariosType'
import type { DataOptionsType } from '@/types/utilTypes'

const path = 'clientes'

async function getList(cliente: ClienteType, dataOptions?: DataOptionsType): Promise<ClienteType[]> {
  const queryString = new URLSearchParams()

  Object.entries(cliente ?? {}).map(prop => queryString.append(prop[0], `${prop[1]}`))

  Object.entries(dataOptions ?? {}).map(prop => queryString.append(prop[0], `${prop[1]}`))

  const { data } = await api.get<ClienteType[]>(`${path}/?${queryString.toString()}`)

  console.log('getList', data)

  return data
}

async function getCliente(token: string): Promise<ClienteType> {
  const { data } = await api.get<ClienteType>(`${path}/${token}`)

  return data
}

async function salvarCliente(cliente: ClienteType): Promise<ClienteType> {
  console.log('incluirCliente', cliente)

  const { data } =
    cliente.token && cliente.token != ''
      ? await api.put<ClienteType>(path, cliente)
      : await api.post<ClienteType>(path, cliente)

  return data
}

async function salvarDadosBancarios(dadosBancarios: DadosBancariosType): Promise<DadosBancariosType> {
  console.log('salvarDadosBancarios', dadosBancarios)

  const { data } = await api.put<DadosBancariosType>(path, dadosBancarios)

  return data
}

async function excluir(token: string): Promise<void | undefined> {
  await api.delete(`${path}/${token}`)
}

async function uploadDocumento(formData: any): Promise<ClienteType> {
  console.log('uploadDocumento', formData)

  const { data } = await api.post<ClienteType>(`${path}/upload`, formData)

  return data
}

export { getList, getCliente, salvarCliente, salvarDadosBancarios, excluir, uploadDocumento }
