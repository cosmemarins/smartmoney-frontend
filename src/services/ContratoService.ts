import type { ContratoType } from '@/types/ContratoType'
import api from './api'
import type { ExtratoType } from '@/types/ExtratoType'

const path = 'contratos'

const ContratoService = {
  getList: async function getList(): Promise<ContratoType[]> {
    const { data } = await api.get<ContratoType[]>(`${path}/`)

    return data
  },

  salvarContrato: async function salvarContrato(contrato: ContratoType): Promise<ContratoType> {
    console.log('incluirContrato', contrato)

    const { data } =
      contrato.token && contrato.token != ''
        ? await api.put<ContratoType>(path, contrato)
        : await api.post<ContratoType>(path, contrato)

    return data
  },

  getExtrato: async function getExtrato(token: string): Promise<ExtratoType[]> {
    const { data } = await api.get<ExtratoType[]>(`${path}/extrato/${token}`)

    return data
  },

  salvarExtrato: async function salvarExtrato(extrato: ExtratoType): Promise<ExtratoType> {
    console.log('incluirExtrato', extrato)

    const { data } =
      extrato.token && extrato.token != ''
        ? await api.put<ExtratoType>(`${path}/extrato`, extrato)
        : await api.post<ExtratoType>(`${path}/extrato`, extrato)

    return data
  },

  salvarExtratoComDocumento: async function salvarExtratoComDocumento(formData: any): Promise<ExtratoType> {
    console.log('salvarExtratoComDocumento', formData)
    const { data } = await api.post<ExtratoType>(`${path}/extrato/com-documento`, formData)

    return data
  }
}

export default ContratoService
