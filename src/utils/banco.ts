import isCPF from '@/utils/cpf'
import isCNPJ from '@/utils/cnpj'

export const getTipoChavePix = (chave: string): string => {
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

export const bancoList = [
  { codigo: '001', nome: 'BANCO DO BRASIL ' },
  { codigo: '002', nome: 'BANCO CENTRAL DO BRASIL' },
  { codigo: '008', nome: 'BANCO MERIDIONAL DO BRASIL' },
  { codigo: '025', nome: 'BANCO ALFA ' },
  { codigo: '033', nome: 'BANCO SANTANDER ' },
  { codigo: '041', nome: 'BANCO DO ESTADO DO RIO GRANDE DO SUL ' },
  { codigo: '070', nome: 'BANCO DE BRASILIA ' },
  { codigo: '077', nome: 'BANCO INTER ' },
  { codigo: '102', nome: 'XP INVESTIMENTOS' },
  { codigo: '104', nome: 'CAIXA ECONOMICA FEDERAL' },
  { codigo: '106', nome: 'BANCO ITABANCO' },
  { codigo: '148', nome: 'MULTI BANCO ' },
  { codigo: '197', nome: 'STONE PAGAMENTOS' },
  { codigo: '205', nome: 'BANCO SUL AMERICA ' },
  { codigo: '208', nome: 'BANCO PACTUAL ' },
  { codigo: '228', nome: 'BANCO ICATU ' },
  { codigo: '233', nome: 'BANCO MAPPIN ' },
  { codigo: '237', nome: 'BANCO BRADESCO ' },
  { codigo: '242', nome: 'BANCO EUROINVEST ' },
  { codigo: '252', nome: 'BANCO FININVEST ' },
  { codigo: '260', nome: 'Nu Pagamentos ' },
  { codigo: '265', nome: 'BANCO FATOR ' },
  { codigo: '266', nome: 'BANCO CEDULA ' },
  { codigo: '290', nome: 'PagSeguro Internet' },
  { codigo: '304', nome: 'BANCO PONTUAL ' },
  { codigo: '318', nome: 'BANCO B.M.G. ' },
  { codigo: '323', nome: 'MercadoPago.com' },
  { codigo: '336', nome: 'BANCO C6' },
  { codigo: '341', nome: 'BANCO ITAU ' },
  { codigo: '346', nome: 'BANCO FRANCES E BRASILEIRO ' },
  { codigo: '347', nome: 'BANCO SUDAMERIS BRASIL ' },
  { codigo: '351', nome: 'BANCO BOZANO SIMONSEN ' },
  { codigo: '353', nome: 'BANCO GERAL DO COMERCIO ' },
  { codigo: '356', nome: 'ABN AMRO ' },
  { codigo: '369', nome: 'PONTUAL' },
  { codigo: '389', nome: 'BANCO MERCANTIL DO BRASIL ' },
  { codigo: '399', nome: 'BANCO BAMERINDUS DO BRASIL ' },
  { codigo: '409', nome: 'UNIBANCO - UNIAO DOS BANCOS BRASILEIROS' },
  { codigo: '422', nome: 'BANCO SAFRA ' },
  { codigo: '453', nome: 'BANCO RURAL ' },
  { codigo: '477', nome: 'CITIBANK N.A' },
  { codigo: '479', nome: 'BANCO DE BOSTON ' },
  { codigo: '600', nome: 'BANCO LUSO BRASILEIRO ' },
  { codigo: '608', nome: 'BANCO OPEN ' },
  { codigo: '623', nome: 'BANCO PANAMERICANO ' },
  { codigo: '647', nome: 'BANCO MARKA ' },
  { codigo: '652', nome: 'BANCO FRANCES E BRASILEIRO SA' },
  { codigo: '745', nome: 'CITIBAN N.A.' }
]
