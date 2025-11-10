import api from '@/services/api'
import type { ComissaoType } from '@/types/ComissaoType'
import type { ComissaoViewType } from '@/types/ComissaoView'

const path = 'financeiro'

const FinanceiroService = {
  getListComissaoMensalParceiros: async function (token?: string): Promise<ComissaoViewType> {
    const { data } = await api.get<ComissaoViewType>(`${path}/comissao/parceiros/${token}`)

    return data
  },

  getComissaoParceiros: async function (token?: string, ano?: number, mes?: number): Promise<ComissaoType[]> {
    const { data } = await api.get<ComissaoType[]>(`${path}/comissao/parceiros/${token}/extrato${ano}/${mes}`)

    return data
  },

  getComissaoAtgInvestidores: async function (token?: string): Promise<ComissaoViewType> {
    const { data } = await api.get<ComissaoViewType>(`${path}/comissao-atg/investidores/${token}`)

    return data
  },

  getComissaoAtgAgentes: async function (token?: string): Promise<ComissaoViewType> {
    const { data } = await api.get<ComissaoViewType>(`${path}/comissao-atg/agentes/${token}`)

    return data
  },

  getComissaoAtgParceiros: async function (token?: string): Promise<ComissaoViewType> {
    const { data } = await api.get<ComissaoViewType>(`${path}/comissao-atg/parceiros/${token}`)

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

  getComissaoAtgGestor: async function (token?: string): Promise<ComissaoViewType> {
    const { data } = await api.get<ComissaoViewType>(`${path}/comissao-atg/gestor/${token}`)

    return data
  }
}

export default FinanceiroService
