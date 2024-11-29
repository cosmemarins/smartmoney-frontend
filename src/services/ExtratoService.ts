import api from './api'
import type { ExtratoType } from '@/types/ExtratoType'

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

  getLastAditivo: async function getLastAditivo(numRegs: number): Promise<ExtratoType[]> {
    const { data } = await api.get<ExtratoType[]>(`${path}/aditivo/last/${numRegs}`)

    return data
  },

  getLastAporte: async function getLastAporte(numRegs: number): Promise<ExtratoType[]> {
    const { data } = await api.get<ExtratoType[]>(`${path}/aporte/last/${numRegs}`)

    return data
  }
}

export default ExtratoService
