'use client'

import api from '@/services/api'
import type { ClienteType } from '@/types/ClienteType'
import type { DadosBancariosType } from '@/types/DadosBancariosType'
import type TamanhoEquipeDTO from '@/types/TamanhoEquipe.dto'
import type { DataOptionsType } from '@/types/utilTypes'
import { TipoDocumentoEnum } from '@/utils/enums/TipoDocumentoEnum'

const path = 'clientes'

async function getListCliente(dataOptions?: DataOptionsType): Promise<ClienteType[]> {
  const queryString = new URLSearchParams()

  //Object.entries(cliente ?? {}).map(prop => queryString.append(prop[0], `${prop[1]}`))

  Object.entries(dataOptions ?? {}).map(prop => queryString.append(prop[0], `${prop[1]}`))

  const { data } = await api.get<ClienteType[]>(`${path}/?${queryString.toString()}`)

  //console.log('getList', data)

  return data
}

async function getCliente(token: string): Promise<ClienteType> {
  const { data } = await api.get<ClienteType>(`${path}/${token}`)

  return data
}

async function getClienteByCpfCnpj(cpfCnpj: string): Promise<ClienteType> {
  const cpfCnpjPar = cpfCnpj.replace(/[^\d]+/g, '')
  const { data } = await api.get<ClienteType>(`${path}/cpf-cnpj/${cpfCnpjPar}`)

  return data
}

async function salvarCliente(cliente: ClienteType): Promise<ClienteType> {
  cliente = {
    ...cliente,
    cpfCnpj: cliente.cpfCnpj?.replace(/[^\d]+/g, '')
  }

  const { data } =
    cliente.token && cliente.token != ''
      ? await api.put<ClienteType>(path, cliente)
      : await api.post<ClienteType>(path, cliente)

  return data
}

async function salvarDadosBancarios(dadosBancarios: DadosBancariosType): Promise<DadosBancariosType> {
  console.log('salvarDadosBancarios', dadosBancarios)

  const { data } = await api.put<DadosBancariosType>(path, dadosBancarios)

  return data
}

async function excluirCliente(token: string): Promise<void | undefined> {
  await api.delete(`${path}/${token}`)
}

async function uploadDocumento(formData: any): Promise<ClienteType> {
  const { data } = await api.post<ClienteType>(`${path}/upload`, formData)

  //console.log('return data', data)

  return data
}

async function getThumbnailCliente(token: string, tipoDocumento: TipoDocumentoEnum) {
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
}

//estatisticas
async function getTotalClientes(token: string): Promise<TamanhoEquipeDTO> {
  const { data } = await api.get<TamanhoEquipeDTO>(`${path}/statistics/total-clientes/${token}`)

  return data
}

export {
  getListCliente,
  getCliente,
  salvarCliente,
  salvarDadosBancarios,
  excluirCliente,
  uploadDocumento,
  getThumbnailCliente,
  getTotalClientes,
  getClienteByCpfCnpj
}
