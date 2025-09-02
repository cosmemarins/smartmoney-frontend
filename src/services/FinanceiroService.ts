import api from '@/services/api'
import { ComissaoFilterType } from '@/types/ComissaoFilterType'
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

  /*
  getComissaoParceirosFiltered: async function (comissaoFilter?: ComissaoFilterType): Promise<ComissaoViewType> {
    
    const queryString = new URLSearchParams()
    Object.entries(comissaoFilter ?? {}).map(prop => queryString.append(prop[0], `${prop[1]}`))
    console.log(comissaoFilter)
    const { data } = await api.get<ComissaoViewType>(`${path}/comissao/parceiros/?${queryString.toString()}`)

    return data
  },
  */

  getComissaoGestor: async function (token?: string): Promise<ComissaoViewType> {
    const { data } = await api.get<ComissaoViewType>(`${path}/comissao/gestor/${token}`)

    return data
  }
}

export default FinanceiroService
