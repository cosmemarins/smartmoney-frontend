'use client'

import api from '@/services/api'
import type { UsuarioType } from '@/types/UsuarioType'
import type { DadosBancariosType } from '@/types/DadosBancariosType'
import type { DataOptionsType } from '@/types/utilTypes'
import { TipoDocumentoEnum } from '@/utils/enums/TipoDocumentoEnum'
import type UsuarioSenhaDTO from '@/types/UsuarioSenha.dto'
import type TamanhoEquipeDTO from '@/types/TamanhoEquipe.dto'
import type { ConfiguracoesUsuarioType } from './../types/ConfiguracoesUsuarioType'
import { PerfilUsuarioEnum } from '@/utils/enums/PerfilUsuarioEnum'
import type { ResumoUsuarioType } from '@/types/ResumoUsuarioType'

const path = 'usuarios'

const UsuarioService = {
  getList: async function (perfil: string, dataOptions?: DataOptionsType): Promise<UsuarioType[]> {
    switch (perfil) {
      case PerfilUsuarioEnum.AGENTE:
        return this.getListAgentes(dataOptions)
      case PerfilUsuarioEnum.PARCEIRO:
        return this.getListParceiros(dataOptions)
      case PerfilUsuarioEnum.OUTROS:
        return this.getListColaboradores(dataOptions)
      default:
        const queryString = new URLSearchParams()

        Object.entries(dataOptions ?? {}).map(prop => queryString.append(prop[0], `${prop[1]}`))
        const { data } = await api.get<UsuarioType[]>(`${path}/?${queryString.toString()}`)

        return data
    }
  },

  getListAgentes: async function (dataOptions?: DataOptionsType): Promise<UsuarioType[]> {
    const queryString = new URLSearchParams()

    Object.entries(dataOptions ?? {}).map(prop => queryString.append(prop[0], `${prop[1]}`))
    const { data } = await api.get<UsuarioType[]>(`${path}/agentes/?${queryString.toString()}`)

    return data
  },

  getListAgentesSelect: async function (): Promise<UsuarioType[]> {
    const { data } = await api.get<UsuarioType[]>(`${path}/agentes/select`)

    return data
  },

  getListParceiros: async function (dataOptions?: DataOptionsType): Promise<UsuarioType[]> {
    const queryString = new URLSearchParams()

    Object.entries(dataOptions ?? {}).map(prop => queryString.append(prop[0], `${prop[1]}`))
    const { data } = await api.get<UsuarioType[]>(`${path}/parceiros/?${queryString.toString()}`)

    return data
  },

  getListParceirosSelect: async function (): Promise<UsuarioType[]> {
    const { data } = await api.get<UsuarioType[]>(`${path}/parceiros/select`)

    return data
  },

  getListComissionadosSelect: async function (): Promise<UsuarioType[]> {
    const { data } = await api.get<UsuarioType[]>(`${path}/comissionados/select`)

    return data
  },

  getListColaboradores: async function (dataOptions?: DataOptionsType): Promise<UsuarioType[]> {
    const queryString = new URLSearchParams()

    Object.entries(dataOptions ?? {}).map(prop => queryString.append(prop[0], `${prop[1]}`))
    const { data } = await api.get<UsuarioType[]>(`${path}/colaboradores/?${queryString.toString()}`)

    return data
  },

  get: async function (token: string): Promise<UsuarioType> {
    const { data } = await api.get<UsuarioType>(`${path}/${token}`)

    return data
  },

  getProfile: async function (): Promise<UsuarioType> {
    const { data } = await api.get<UsuarioType>(`${path}/profile`)

    return data
  },

  getByCpfCnpj: async function (cpfCnpj: string): Promise<UsuarioType> {
    const cpfCnpjPar = cpfCnpj.replace(/[^\d]+/g, '')
    const { data } = await api.get<UsuarioType>(`${path}/cpf-cnpj/${cpfCnpjPar}`)

    return data
  },

  getByTokenSenha: async function (tokenSenha: string): Promise<UsuarioType> {
    const { data } = await api.get<UsuarioType>(`${path}/token-senha/${tokenSenha}`)

    return data
  },

  salvar: async function (usuario: UsuarioType): Promise<UsuarioType> {
    //console.log('incluirUsuario', usuario)

    const { data } =
      usuario.token && usuario.token != ''
        ? await api.put<UsuarioType>(path, usuario)
        : await api.post<UsuarioType>(path, usuario)

    return data
  },

  esqueciSenha: async function (email: string): Promise<UsuarioType> {
    //console.log('incluirUsuario', usuario)

    const { data } = await api.post<UsuarioType>(`${path}/esqueci-senha`, { email: email })

    return data
  },

  salvarDadosBancarios: async function (dadosBancarios: DadosBancariosType): Promise<DadosBancariosType> {
    console.log('salvarDadosBancarios', dadosBancarios)

    const { data } = await api.put<DadosBancariosType>(path, dadosBancarios)

    return data
  },

  salvarConfiguracoes: async function (
    configuracoesUsuario: ConfiguracoesUsuarioType
  ): Promise<ConfiguracoesUsuarioType> {
    const { data } = await api.put<ConfiguracoesUsuarioType>(
      `${path}/${configuracoesUsuario.token}/configuracoes`,
      configuracoesUsuario
    )

    return data
  },

  ativar: async function ativar(token: string): Promise<UsuarioType> {
    const { data } = await api.post<UsuarioType>(`${path}/ativar/${token}`)

    return data
  },

  excluir: async function (token: string): Promise<void | undefined> {
    await api.delete(`${path}/${token}`)
  },

  finalizarNovo: async function (token: string, usuarioSenha: UsuarioSenhaDTO): Promise<UsuarioType> {
    const { data } = await api.post<UsuarioType>(`${path}/${token}/finalizar-novo`, usuarioSenha)

    return data
  },

  uploadDocumento: async function (formData: any): Promise<UsuarioType> {
    const { data } = await api.post<UsuarioType>(`${path}/upload`, formData)

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

  salvarSenha: async function (token: string, usuarioSenha: UsuarioSenhaDTO): Promise<DadosBancariosType> {
    const { data } = await api.post<DadosBancariosType>(`${path}/salvar-senha/${token}`, usuarioSenha)

    return data
  },

  resetarSenha: async function (token: string, usuarioSenha: UsuarioSenhaDTO): Promise<DadosBancariosType> {
    const { data } = await api.post<DadosBancariosType>(`${path}/resetar-senha/${token}`, usuarioSenha)

    return data
  },

  getResumo: async function getResumo(token: string): Promise<ResumoUsuarioType> {
    const { data } = await api.get<ResumoUsuarioType>(`${path}/resumo/${token}`)

    return data
  },

  //estatisticas
  getTotalEquipe: async function (token: string): Promise<TamanhoEquipeDTO> {
    const { data } = await api.get<TamanhoEquipeDTO>(`${path}/statistics/total-equipe/${token}`)

    return data
  }
}

export default UsuarioService
