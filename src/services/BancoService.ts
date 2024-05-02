import api from './api'
import type { BancoType } from '../types/BancoType'

const path = 'bancos'

async function getBancoList(): Promise<BancoType[]> {
  const { data } = await api.get<BancoType[]>(path)

  console.log('getdata', data)

  return data
}

export default getBancoList
