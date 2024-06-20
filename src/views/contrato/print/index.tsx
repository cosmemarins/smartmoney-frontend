'use client'

// React Imports
import { useEffect, useRef, useState } from 'react'

import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'

// Style Imports

// Component Imports
import moment, { locale } from 'moment'

import Logo from '@components/layout/shared/Logo'

import 'moment/locale/pt-br'

import ArquivoService from '@/services/ArquivoService'
import type { ArquivoType } from '@/types/ArquivoType'
import ArquivoItem from '../preview/ArquivoItem'
import ContratoService from '@/services/ContratoService'
import type { ContratoType } from '@/types/ContratoType'
import type { ClienteType } from '@/types/ClienteType'
import { getCliente } from '@/services/ClienteService'

locale('pt-br')

interface props {
  token: string
}

const ContratoPrint = ({ token }: props) => {
  const [cliente, setCliente] = useState<ClienteType>()
  const [contrato, setContrato] = useState<ContratoType>()
  const [arquivoList, setArquivoList] = useState<ArquivoType[]>([])

  // Refs
  const initialized = useRef(false)

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true

      ContratoService.get(token)
        .then(contratoResp => {
          console.log('contratoResp', contratoResp)

          if (contratoResp) {
            setContrato(contratoResp)

            if (contratoResp.cliente && contratoResp.cliente.token) {
              getCliente(contratoResp.cliente.token)
                .then(clienteResp => {
                  setCliente(clienteResp)

                  if (clienteResp?.token) {
                    ArquivoService.getListCliente(clienteResp.token)
                      .then(respList => {
                        setArquivoList(respList)
                      })
                      .finally(() => {
                        console.log('finaly arquivo')
                      })
                  }
                })
                .finally(() => {
                  setTimeout(() => {
                    window.print()
                  }, 1000)
                })
            }
          }
        })
        .finally(() => {})
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <div className='p-6 bg-actionHover rounded'>
          <div className='flex justify-between gap-y-4 flex-col sm:flex-row'>
            <div className='flex flex-col gap-6'>
              <div className='flex items-center gap-2.5'>
                <Logo />
              </div>
              <div>
                <Typography color='text.primary'>Endereço da smart money</Typography>
                <Typography color='text.primary'>Cidade, estado, cep</Typography>
                <Typography color='text.primary'>+1 (123) 456 7891, +44 (876) 543 2198</Typography>
              </div>
            </div>
            <div className='flex flex-col gap-6'>
              <Typography variant='h5'>{`Contrato #${contrato?.token}`}</Typography>
              <div className='flex flex-col gap-1'>
                <Typography color='text.primary'>{cliente?.nome}</Typography>
                <Typography color='text.primary'>{cliente?.cpfCnpj}</Typography>
              </div>
            </div>
          </div>
        </div>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={6}>
          <Grid item xs={12} sm={6}>
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
                  <Typography className='min-is-[100px]'>CPF/CNPJ:</Typography>
                  <Typography>{cliente?.cpfCnpj}</Typography>
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
          <Grid item xs={12} sm={6}>
            <div className='flex flex-col gap-4'>
              <Typography className='font-medium' color='text.primary'>
                Dados do contrato:
              </Typography>
              <div>
                <div className='flex items-center gap-4'>
                  <Typography className='min-is-[100px]'>Data:</Typography>
                  <Typography>{contrato?.data ? moment(contrato?.data).format('DD/MM/YYYY HH:mm') : ''}</Typography>
                </div>
                <div className='flex items-center gap-4'>
                  <Typography className='min-is-[100px]'>Valor:</Typography>
                  <Typography>{contrato?.valor}</Typography>
                </div>
                <div className='flex items-center gap-4'>
                  <Typography className='min-is-[100px]'>CCB:</Typography>
                  <Typography>{contrato?.taxaCcb} % - R$ 0,00 (calcular?)</Typography>
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
  )
}

export default ContratoPrint
