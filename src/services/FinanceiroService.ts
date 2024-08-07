import api from '@/services/api'
import type { ComissaoViewType } from '@/types/ComissaoView'

const path = 'financeiro'

const FinanceiroService = {
  getComissaoInvestidores: async function (token?: string): Promise<ComissaoViewType> {
    const { data } = await api.get<ComissaoViewType>(`${path}/comissao/investidores/${token}`)

    return data
  },

  getComissaoAgentes: async function (token?: string): Promise<ComissaoViewType> {
    const { data } = await api.get<ComissaoViewType>(`${path}/comissao/agentes/${token}`)

    return data
  },

  getComissaoParceiros: async function (token?: string): Promise<ComissaoViewType> {
    const { data } = await api.get<ComissaoViewType>(`${path}/comissao/parceiros/${token}`)

    return data
  },

  getComissaoGestor: async function (token?: string): Promise<ComissaoViewType> {
    const { data } = await api.get<ComissaoViewType>(`${path}/comissao/gestor/${token}`)

    return data
  }
}

export default FinanceiroService
