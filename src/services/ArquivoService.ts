import type { ArquivoType } from '@/types/ArquivoType'
import api from './api'

const path = 'arquivos'

const ArquivoService = {
  getList: async function getList(tokenCliente: string): Promise<ArquivoType[]> {
    const { data } = await api.get<ArquivoType[]>(`${path}/cliente/${tokenCliente}`)

    return data
  },

  get: async function get(token: string): Promise<ArquivoType> {
    const { data } = await api.get<ArquivoType>(`${path}/${token}`)

    return data
  },

  update: async function update(arquivo: ArquivoType): Promise<ArquivoType> {
    const { data } = await api.put<ArquivoType>(path, arquivo)

    return data
  },

  salvarArquivo: async function salvarArquivo(formData: any): Promise<ArquivoType> {
    console.log('salvarArquivo: ', formData.values)
    const { data } = await api.post<ArquivoType>(`${path}`, formData)

    return data
  },

  excluir: async function excluir(token: string) {
    //console.log('Excluindo o contrato: ', token)
    const { data } = await api.delete<string>(`${path}/${token}`)

    return data
  },

  getListCliente: async function getListCliente(token: string): Promise<ArquivoType[]> {
    const { data } = await api.get<ArquivoType[]>(`${path}/clientes/${token}`)

    return data
  },

  getListUsuario: async function getListUsuario(token: string): Promise<ArquivoType[]> {
    const { data } = await api.get<ArquivoType[]>(`${path}/usuarios/${token}`)

    return data
  },

  getThumbnail: async function getThumbnail(token: string) {
    const response = await api.get(`${path}/thumb/${token}`, {
      responseType: 'arraybuffer'
    })

    return Buffer.from(response.data, 'binary').toString('base64')
  }
}

export default ArquivoService
