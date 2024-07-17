'use client'
import { useEffect, useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'

// Component Imports
import moment, { locale } from 'moment'

import { toast } from 'react-toastify'

import Logo from '@components/layout/shared/Logo'

import 'moment/locale/pt-br'

import { useClienteContext } from '@/contexts/ClienteContext'
import { useContratoContext } from '@/contexts/ContratoContext'

import ArquivoService from '@/services/ArquivoService'
import { trataErro } from '@/utils/erro'
import type { ArquivoType } from '@/types/ArquivoType'
import ArquivoItem from './ArquivoItem'
import { cpfCnpjMask, valorEmReal } from '@/utils/string'

locale('pt-br')

const PreviewCard = () => {
  //contexto
  const { cliente, isCpf } = useClienteContext()

  const { contrato } = useContratoContext()

  const [arquivoList, setArquivoList] = useState<ArquivoType[]>([])

  useEffect(() => {
    if (cliente?.token) {
      //precisa recuperar por aqui pois tem que ser via axios por causa da validação de seção
      ArquivoService.getListCliente(cliente.token)
        .then(respList => {
          setArquivoList(respList)
        })
        .catch(err => {
          toast.error(trataErro(err))
        })
        .finally(() => {})
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Card>
      <CardContent className='sm:!p-12'>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <div className='p-6 bg-actionHover rounded'>
              <div className='flex justify-between gap-y-4 flex-col sm:flex-row'>
                <div className='flex flex-col gap-6'>
                  <Typography variant='h5'>{`Contrato #${contrato?.token}`}</Typography>
                  <div className='flex flex-col gap-1'>
                    <Typography color='text.primary'>{cliente?.nome}</Typography>
                    <Typography color='text.primary'>{cpfCnpjMask(cliente?.cpfCnpj)}</Typography>
                  </div>
                </div>
                <div className='flex flex-col gap-6'>
                  <div className='flex items-center gap-2.5'>
                    <Logo />
                  </div>
                  <div>
                    <Typography color='text.primary'></Typography>
                    <Typography color='text.primary'></Typography>
                    <Typography color='text.primary'></Typography>
                  </div>
                </div>
              </div>
            </div>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={6}>
              <Grid item xs={12} sm={7}>
                <div className='flex flex-col gap-4'>
                  <Typography className='font-medium' color='text.primary'>
                    Dados do investidor:
                  </Typography>
                  <div>
                    <div className='flex items-center gap-4'>
                      <Typography className='min-is-[100px]'>Nome:</Typography>
                      <Typography className='font-medium' color='text.primary'>
                        {cliente?.nome}
                      </Typography>
                    </div>
                    <div className='flex items-center gap-4'>
                      <Typography className='min-is-[100px]'>{isCpf ? 'CPF' : 'CNPJ'}</Typography>
                      <Typography>{cpfCnpjMask(cliente?.cpfCnpj)}</Typography>
                    </div>
                    <div className='flex items-center gap-4'>
                      <Typography className='min-is-[100px]'>Nascimento: </Typography>
                      <Typography>{moment(cliente?.dataNascimento).format('DD/MM/YYYY')}</Typography>
                    </div>
                    <div className='flex items-center gap-4'>
                      <Typography className='min-is-[100px]'>E-mail: </Typography>
                      <Typography>{cliente?.email}</Typography>
                    </div>
                    <div className='flex items-center gap-4'>
                      <Typography className='min-is-[100px]'>Telefone: </Typography>
                      <Typography>{cliente?.telefone}</Typography>
                    </div>
                    <div className='flex items-center gap-4'>
                      <Typography className='min-is-[100px]'>Endereço: </Typography>
                      <Typography>
                        {cliente?.endereco}, {cliente?.numero} - {cliente?.cidade} / {cliente?.estado}
                      </Typography>
                    </div>
                    <div className='flex items-center gap-4'>
                      <Typography className='min-is-[100px]'>CEP: </Typography>
                      <Typography>{cliente?.cep}</Typography>
                    </div>
                  </div>
                </div>
              </Grid>
              <Grid item xs={12} sm={5}>
                <div className='flex flex-col gap-4'>
                  <Typography className='font-medium' color='text.primary'>
                    Dados do contrato:
                  </Typography>
                  <div>
                    <div className='flex items-center gap-4'>
                      <Typography className='min-is-[100px]'>Contrato:</Typography>
                      <Typography>{contrato?.token}</Typography>
                    </div>
                    <div className='flex items-center gap-4'>
                      <Typography className='min-is-[100px]'>Data:</Typography>
                      <Typography>{contrato?.data ? moment(contrato?.data).format('DD/MM/YYYY HH:mm') : ''}</Typography>
                    </div>
                    <div className='flex items-center gap-4'>
                      <Typography className='min-is-[100px]'>Valor:</Typography>
                      <Typography>{valorEmReal.format(contrato?.valor || 0)}</Typography>
                    </div>
                    <div className='flex items-center gap-4'>
                      <Typography className='min-is-[100px]'>CCB:</Typography>
                      <Typography>
                        {contrato?.taxaCcb}% -
                        {contrato && contrato.valor && contrato.taxaCcb
                          ? valorEmReal.format(contrato.valor * (contrato.taxaCcb / 100))
                          : 'R$ 0,00'}{' '}
                      </Typography>
                    </div>
                    <div className='flex items-center gap-4'>
                      <Typography className='min-is-[100px]'>Rentabilidade:</Typography>
                      <Typography>{contrato?.taxaCliente}%</Typography>
                    </div>
                    <div className='flex items-center gap-4'>
                      <Typography className='min-is-[100px]'>Prazo: </Typography>
                      <Typography>{contrato?.prazo} meses</Typography>
                    </div>
                  </div>
                </div>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} className='gap-4'>
            <Divider className='border-dashed' />
          </Grid>
          <Grid item xs={12}>
            <Typography className='font-medium' color='text.primary'>
              Anexos:
            </Typography>
          </Grid>
          <Grid item xs={4} className='flex flex-row gap-4'>
            {arquivoList.map((arquivo, key) => (
              <Grid key={key}>
                <ArquivoItem arquivo={arquivo} />
              </Grid>
            ))}
          </Grid>
          <Grid item xs={12} className='gap-4'>
            <Divider className='border-dashed' />
          </Grid>
          <Grid item xs={12}>
            <Typography>
              <Typography component='span' className='font-medium' color='text.primary'>
                Observações:
              </Typography>{' '}
              {contrato?.observacao}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default PreviewCard
