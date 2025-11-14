import api from '@/services/api'
import type { ComissaoAgrupadaFront } from '@/types/ComissaoAgrupadaFront'
import type { ComissaoExtratoFront } from '@/types/ComissaoExtratoFront'
import type { ComissaoType } from '@/types/ComissaoType'
import type { ComissaoViewType } from '@/types/ComissaoView'

const path = 'financeiro'

const FinanceiroService = {
  getListComissaoMensalParceiros: async function (
    token?: string,
    ano?: string,
    mes?: string
  ): Promise<ComissaoViewType> {
    const { data } = await api.get<ComissaoViewType>(`${path}/comissao/parceiros/${token}/${ano}/${mes}`)

    return data
  },

  getListComissaoMensalAgentes: async function (token?: string, ano?: string, mes?: string): Promise<ComissaoViewType> {
    const { data } = await api.get<ComissaoViewType>(`${path}/comissao/agentes/${token}/${ano}/${mes}`)

    return data
  },

  getListComissaoMensalGestor: async function (token?: string, ano?: string, mes?: string): Promise<ComissaoViewType> {
    const { data } = await api.get<ComissaoViewType>(`${path}/comissao/gestor/${token}/${ano}/${mes}`)

    return data
  },

  getComissaoInvestidores: async function (token: string, ano: string, mes: string): Promise<ComissaoType[]> {
    const { data } = await api.get<ComissaoType[]>(`${path}/comissao/investidores/extrato/${token}/${ano}/${mes}`)

    return data
  },

  getComissaoParceiros: async function (token?: string, ano?: string, mes?: string): Promise<ComissaoExtratoFront> {
    const { data } = await api.get<ComissaoExtratoFront>(`${path}/comissao/parceiros/extrato/${token}/${ano}/${mes}`)

    return data
  },

  getComissaoAgentes: async function (token?: string, ano?: string, mes?: string): Promise<ComissaoExtratoFront> {
    const { data } = await api.get<ComissaoExtratoFront>(`${path}/comissao/agentes/extrato/${token}/${ano}/${mes}`)

    return data
  },

  getComissaoGestor: async function (token?: string, ano?: string, mes?: string): Promise<ComissaoType[]> {
    const { data } = await api.get<ComissaoType[]>(`${path}/comissao/gestor/extrato/${token}/${ano}/${mes}`)

    return data
  },

  getListComissaoParceirosAgrupadaMesAno: async function (
    token?: string,
    ano?: string,
    mes?: string
  ): Promise<ComissaoAgrupadaFront> {
    let urlMesAno = ''

    const tokenConsulta = !token || token == 'undefined' ? 'all' : token

    if (ano && mes && ano != undefined && mes != undefined && ano != 'all' && mes != 'all') {
      urlMesAno = `${ano}/${mes}`
    }

    const { data } = await api.get<ComissaoAgrupadaFront>(
      `${path}/comissao/mensal/parceiros/${tokenConsulta}/${urlMesAno}`
    )

    return data
  },

  getListComissaoAgentesAgrupadaMesAno: async function (
    token?: string,
    ano?: string,
    mes?: string
  ): Promise<ComissaoAgrupadaFront> {
    let urlMesAno = ''

    const tokenConsulta = !token || token == 'undefined' ? 'all' : token

    if (ano && mes && ano != undefined && mes != undefined && ano != 'all' && mes != 'all') {
      urlMesAno = `${ano}/${mes}`
    }

    const { data } = await api.get<ComissaoAgrupadaFront>(
      `${path}/comissao/mensal/agentes/${tokenConsulta}/${urlMesAno}`
    )

    return data
  },

  getListComissaoMensalInvestidores: async function (
    token: string,
    ano?: string,
    mes?: string
  ): Promise<ComissaoViewType> {
    let url = ''

    if (ano && mes && ano != undefined && mes != undefined && ano != 'all' && mes != 'all') {
      url = `${ano}/${mes}`
    }

    const { data } = await api.get<ComissaoViewType>(`${path}/comissao/investidores/${token}/${url}`)

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
