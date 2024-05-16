import api from './api'
import type { BancoType } from '../types/BancoType'
import isCPF from '@/utils/cpf'
import isCNPJ from '@/utils/cnpj'

const path = 'bancos'

const BancoService = {
  getList: async function getList(): Promise<BancoType[]> {
    const { data } = await api.get<BancoType[]>(`${path}/`)

    return data
  },

  getTipoChavePix: function getTipoChavePix(chave: string): string {
    //tiposPix = ['CPF', 'CNPJ', 'Email', 'Celular', 'Chave aleatória']
    let strTeste = chave.replace(/\D/g, '') // apenas numeros

    if (strTeste.match(/^[0-9]{11}$/) && isCPF(strTeste)) return 'CPF'
    if (strTeste.match(/^[0-9]{11}$/)) return 'Celular'
    if (strTeste.match(/^[0-9]{14}$/) && isCNPJ(strTeste)) return 'CNPJ'

    strTeste = chave //chave.replace(/\s/g, '') // tira os espaços
    if (strTeste.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) return 'Email'

    strTeste = chave.replace(/[^a-f0-9]/g, '') // tira os espaços
    if (strTeste.match(/[0-9a-f]{8}[0-9a-f]{4}[0-9a-f]{4}[0-9a-f]{4}[0-9a-f]{12}/)) return 'Random'

    return ''
  }
}

export default BancoService
