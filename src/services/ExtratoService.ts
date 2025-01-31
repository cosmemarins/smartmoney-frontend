import api from './api'
import type { ExtratoFilterType, ExtratoType } from '@/types/ExtratoType'

const path = 'extrato'

const ExtratoService = {
  get: async function get(token: string): Promise<ExtratoType> {
    const { data } = await api.get<ExtratoType>(`${path}/${token}`)

    return data
  },

  getById: async function getById(id: number): Promise<ExtratoType> {
    const { data } = await api.get<ExtratoType>(`${path}/id/${id}`)

    return data
  },

  list: async function list(extratoFilter: ExtratoFilterType = {}): Promise<ExtratoType[]> {
    const queryString = new URLSearchParams()

    Object.entries(extratoFilter ?? {}).map(prop => queryString.append(prop[0], `${prop[1]}`))

    const { data } = await api.get<ExtratoType[]>(`${path}/?${queryString.toString()}`)

    return data
  },

  listAditivos: async function listAditivos(extratoFilter: ExtratoFilterType = {}): Promise<ExtratoType[]> {
    const queryString = new URLSearchParams()

    Object.entries(extratoFilter ?? {}).map(prop => queryString.append(prop[0], `${prop[1]}`))

    const { data } = await api.get<ExtratoType[]>(`${path}/aditivos/?${queryString.toString()}`)

    return data
  },

  listAportes: async function listAportes(extratoFilter: ExtratoFilterType = {}): Promise<ExtratoType[]> {
    const queryString = new URLSearchParams()

    Object.entries(extratoFilter ?? {}).map(prop => queryString.append(prop[0], `${prop[1]}`))

    const { data } = await api.get<ExtratoType[]>(`${path}/aportes/?${queryString.toString()}`)

    return data
  },

  getLastAditivo: async function getLastAditivo(numRegs: number): Promise<ExtratoType[]> {
    const { data } = await api.get<ExtratoType[]>(`${path}/aditivo/last/${numRegs}`)

    return data
  },

  getLastAporte: async function getLastAporte(numRegs: number): Promise<ExtratoType[]> {
    const { data } = await api.get<ExtratoType[]>(`${path}/aporte/last/${numRegs}`)

    return data
  },

  excluir: async function excluir(token: string) {
    const { data } = await api.delete<string>(`${path}/${token}`)

    return data
  }
}

export default ExtratoService
