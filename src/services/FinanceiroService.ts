import api from '@/services/api'
import type { ComissaoType } from '@/types/ComissaoType'

const path = 'financeiro'

const FinanceiroService = {
  getComissaoInvestidores: async function (token?: string): Promise<ComissaoType[]> {
    const { data } = await api.get<ComissaoType[]>(`${path}/comissao/investidores/${token}`)

    return data
  },

  getComissaoAgentes: async function (token?: string): Promise<ComissaoType[]> {
    const { data } = await api.get<ComissaoType[]>(`${path}/comissao/agentes/${token}`)

    return data
  },

  getComissaoParceiros: async function (token?: string): Promise<ComissaoType[]> {
    const { data } = await api.get<ComissaoType[]>(`${path}/comissao/parceiros/${token}`)

    return data
  },

  getComissaoDiretor: async function (token?: string): Promise<ComissaoType[]> {
    const { data } = await api.get<ComissaoType[]>(`${path}/comissao/diretor/${token}`)

    return data
  }
}

export default FinanceiroService
