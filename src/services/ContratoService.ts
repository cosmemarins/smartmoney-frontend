import type { ContratoType } from '@/types/ContratoType'
import api from './api'
import type { ExtratoType } from '@/types/ExtratoType'
import type TamanhoEquipeDTO from '@/types/TamanhoEquipe.dto'
import type { ArquivoType } from '@/types/ArquivoType'

const path = 'contratos'

const ContratoService = {
  getList: async function getList(): Promise<ContratoType[]> {
    const { data } = await api.get<ContratoType[]>(`${path}`)

    return data
  },

  getListByCliente: async function getListByCliente(tokenCliente: string): Promise<ContratoType[]> {
    const { data } = await api.get<ContratoType[]>(`${path}/cliente/${tokenCliente}`)

    return data
  },

  get: async function get(token: string): Promise<ContratoType> {
    const { data } = await api.get<ContratoType>(`${path}/${token}`)

    return data
  },

  getAporte: async function getAporte(token: string): Promise<ExtratoType> {
    const { data } = await api.get<ExtratoType>(`${path}/aporte/${token}`)

    return data
  },

  getUltimoContratoNovo: async function getUltimoContratoNovo(token: string): Promise<ContratoType> {
    const { data } = await api.get<ContratoType>(`${path}/cliente/ultimo-novo/${token}`)

    return data
  },

  salvarContrato: async function salvarContrato(contrato: ContratoType, trocaContrato: boolean): Promise<ContratoType> {
    //console.log('salvarContrato', contrato)

    if (!trocaContrato) {
      const { data } =
        contrato.token && contrato.token != ''
          ? await api.put<ContratoType>(path, contrato)
          : await api.post<ContratoType>(path, contrato)

      return data
    } else {
      if (!contrato.contratoPai?.token) throw new Error('Contrato pai precisa ser informado!')

      //simplificando o objeto para envio
      const contratoEvia = {
        ...contrato,
        cliente: {
          token: contrato.cliente?.token
        },
        contratoPai: {
          token: contrato.contratoPai.token
        }
      }

      console.log('contratoEvia', contratoEvia)

      const { data } = await api.post<ContratoType>(
        `${path}/trocar-contrato/${contrato.contratoPai?.token}`,
        contratoEvia
      )

      return data
    }
  },

  enviarContrato: async function enviarContrato(token: string): Promise<ContratoType> {
    const { data } = await api.post<ContratoType>(`${path}/enviar-contrato/${token}`, { token })

    return data
  },

  cancelarContrato: async function cancelarContrato(token: string): Promise<ContratoType> {
    const { data } = await api.post<ContratoType>(`${path}/cancelar/${token}`, { token })

    return data
  },

  ativarContrato: async function ativarContrato(token: string): Promise<ContratoType> {
    const { data } = await api.post<ContratoType>(`${path}/ativar/${token}`, { token })

    return data
  },

  excluirContrato: async function excluirContrato(token: string) {
    //console.log('Excluindo o contrato: ', token)
    const { data } = await api.delete<string>(`${path}/${token}`)

    return data
  },

  getExtrato: async function getExtrato(token: string): Promise<ExtratoType[]> {
    const { data } = await api.get<ExtratoType[]>(`${path}/extrato/${token}`)

    return data
  },

  getSaldo: async function getSaldo(token: string): Promise<number> {
    const { data } = await api.get<number>(`${path}/saldo/${token}`)

    return data
  },

  getExtratoComArquivos: async function getExtrato(token: string): Promise<ExtratoType[]> {
    const { data } = await api.get<ExtratoType[]>(`${path}/extrato-arquivos/${token}`)

    return data
  },

  listDocumentos: async function listDocumentos(token: string): Promise<ArquivoType[]> {
    const { data } = await api.get<ArquivoType[]>(`${path}/documentos/${token}`)

    return data
  },

  salvarExtrato: async function salvarExtrato(extrato: ExtratoType): Promise<ExtratoType> {
    console.log('salvarExtrato', extrato)

    const { data } =
      extrato.token && extrato.token != ''
        ? await api.put<ExtratoType>(`${path}/extrato`, extrato)
        : await api.post<ExtratoType>(`${path}/extrato`, extrato)

    return data
  },

  salvarExtratoComDocumento: async function salvarExtratoComDocumento(formData: any): Promise<ExtratoType> {
    console.log('salvarExtratoComDocumento', formData.values)
    const { data } = await api.post<ExtratoType>(`${path}/extrato/com-documento`, formData)

    return data
  },

  excluirExtrato: async function excluirExtrato(token: string) {
    //console.log('Excluindo o extrato: ', token)
    const { data } = await api.delete<string>(`${path}/extrato/${token}`)

    return data
  },

  getThumbnail: async function getThumbnail(token: string) {
    //console.log('Excluindo o extrato: ', token)
    const response = await api.get(`${path}/extrato/thumbnail/${token}`, {
      responseType: 'arraybuffer'
    })

    //.then(response => {
    //  return Buffer.from(response.data, 'binary').toString('base64')
    //})
    return Buffer.from(response.data, 'binary').toString('base64')
  },

  //estatisticas
  getTotalContratos: async function getTotalClientes(token: string): Promise<TamanhoEquipeDTO> {
    const { data } = await api.get<TamanhoEquipeDTO>(`${path}/statistics/total-contratos/${token}`)

    return data
  }
}

export default ContratoService
