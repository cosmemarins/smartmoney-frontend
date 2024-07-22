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
  }
}

export default ExtratoService
