import api from '@/services/api'
import type { ParceiroType } from '@/types/ParceiroType'
import type { DadosBancariosType } from '@/types/DadosBancariosType'
import type { DataOptionsType } from '@/types/utilTypes'
import { TipoDocumentoEnum } from '@/utils/enums/TipoDocumentoEnum'
import type TamanhoEquipeDTO from '@/types/TamanhoEquipe.dto'
import type { ConfiguracoesParceiroType } from '../types/ConfiguracoesParceiroType'
import type { ComissionamentoType } from '@/types/ComissionamentoType'
import type { UsuarioType } from '@/types/UsuarioType'
import type UsuarioSenhaDTO from '@/types/UsuarioSenha.dto'

const path = 'parceiros'

const ParceiroService = {
  getList: async function (dataOptions?: DataOptionsType): Promise<ParceiroType[]> {
    const queryString = new URLSearchParams()

    Object.entries(dataOptions ?? {}).map(prop => queryString.append(prop[0], `${prop[1]}`))
    const { data } = await api.get<ParceiroType[]>(`${path}/?${queryString.toString()}`)

    //console.log('getList', data)

    return data
  },

  get: async function (token: string): Promise<ParceiroType> {
    const { data } = await api.get<ParceiroType>(`${path}/${token}`)

    return data
  },

  getByCnpj: async function (cnpj: string): Promise<ParceiroType> {
    const cpfCnpjPar = cnpj.replace(/[^\d]+/g, '')
    const { data } = await api.get<ParceiroType>(`${path}/cnpj/${cpfCnpjPar}`)

    return data
  },

  salvar: async function (parceiro: ParceiroType): Promise<ParceiroType> {
    //console.log('incluirUsuario', usuario)

    const { data } =
      parceiro.token && parceiro.token != ''
        ? await api.put<ParceiroType>(path, parceiro)
        : await api.post<ParceiroType>(path, parceiro)

    return data
  },

  salvarUsuario: async function (token: string, usuario: UsuarioType): Promise<ParceiroType> {
    if (!token || token === '') throw new Error('É preciso informar um parceiro!')

    const { data } =
      usuario?.token && usuario?.token != ''
        ? await api.put<ParceiroType>(`${path}/${token}/usuario`, usuario)
        : await api.post<ParceiroType>(`${path}/${token}/usuario`, usuario)

    return data
  },

  salvarDadosBancarios: async function (dadosBancarios: DadosBancariosType): Promise<DadosBancariosType> {
    console.log('salvarDadosBancarios', dadosBancarios)

    const { data } = await api.put<DadosBancariosType>(path, dadosBancarios)

    return data
  },

  salvarConfiguracoes: async function (
    token: string,
    configuracoesParceiro: ConfiguracoesParceiroType
  ): Promise<ConfiguracoesParceiroType> {
    const { data } = await api.put<ConfiguracoesParceiroType>(`${path}/${token}/configuracoes`, configuracoesParceiro)

    return data
  },

  finalizarNovo: async function (token: string, usuarioSenha: UsuarioSenhaDTO): Promise<ConfiguracoesParceiroType> {
    const { data } = await api.post<ConfiguracoesParceiroType>(`${path}/${token}/finalizar-novo`, usuarioSenha)

    return data
  },

  excluir: async function (token: string): Promise<void | undefined> {
    await api.delete(`${path}/${token}`)
  },

  uploadDocumento: async function (formData: any): Promise<ParceiroType> {
    const { data } = await api.post<ParceiroType>(`${path}/upload`, formData)

    //console.log('return data', data)

    return data
  },

  getThumbnail: async function (token: string, tipoDocumento: TipoDocumentoEnum) {
    //console.log('Excluindo o extrato: ', token)
    let tipo

    switch (tipoDocumento) {
      case TipoDocumentoEnum.IDENTIDADE:
        tipo = 'identidade'
        break
      case TipoDocumentoEnum.COMPROVANTE_FINANCEIRO:
        tipo = 'comp-financeiro'
        break
      case TipoDocumentoEnum.COMPROVANTE_RESIDENCIA:
        tipo = 'comp-residencia'
        break
    }

    const response = await api.get(`${path}/thumb/${tipo}/${token}`, {
      responseType: 'arraybuffer'
    })

    //.then(response => {
    //  return Buffer.from(response.data, 'binary').toString('base64')
    //})
    return Buffer.from(response.data, 'binary').toString('base64')
  },

  //estatisticas
  getTotalParceiros: async function (token: string): Promise<TamanhoEquipeDTO> {
    const { data } = await api.get<TamanhoEquipeDTO>(`${path}/statistics/total-parceiros/${token}`)

    return data
  },

  getComissionamento: async function (token?: string): Promise<ComissionamentoType[]> {
    const { data } = await api.get<ComissionamentoType[]>(`${path}/comissionamento/${token}`)

    return data
  }
}

export default ParceiroService
