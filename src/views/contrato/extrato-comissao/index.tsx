'use client'

import { useEffect, useRef, useState } from 'react'

// Type Imports
import { useSession } from 'next-auth/react'

import moment, { locale } from 'moment'
import 'moment/locale/pt-br'

import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import {
  Backdrop,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  styled
} from '@mui/material'

import { toast } from 'react-toastify'

import ContratoService from '@/services/ContratoService'
import type { ComissaoType } from '@/types/ComissaoType'
import { valorBr, valorEmReal } from '@/utils/string'
import { getStatusContratoEnumColor, getStatusContratoEnumDesc } from '@/utils/enums/StatusContratoEnum'
import { getTipoExtratoEnumColor, getTipoExtratoEnumDesc } from '@/utils/enums/TipoExtratoEnum'
import { trataErro } from '@/utils/erro'
import type { ContratoType } from '@/types/ContratoType'
import { isMaster, isParceiroMaster } from '@/utils/utils'

locale('pt-br')

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover
  },

  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0
  }
}))

interface props {
  token: string
}

export default function ExtratoComissaoContrato({ token }: props) {
  // context
  const { data: session } = useSession()

  // States
  const [contrato, setContrato] = useState<ContratoType>()

  //const [saldo, setSaldo] = useState<number>(0)
  const [comissaoList, setComissaoList] = useState<ComissaoType[]>([])
  const [reload, setReload] = useState(false)
  const [openDlgRefazerComissao, setOpenDlgRefazerComissao] = useState<boolean>(false)

  // Refs
  const initialized = useRef(false)

  const handleRefazerComissao = () => {
    if (contrato) {
      setOpenDlgRefazerComissao(true)
    }
  }

  const confirmComissionar = () => {
    if (contrato && contrato.token) {
      setReload(true)
      ContratoService.comissionar(contrato.token, false)
        .then(() => {
          refreshListComissao(contrato?.token)
          setOpenDlgRefazerComissao(false)
          toast.success(`Contrato de ${contrato.cliente?.nome} comissionado com sucesso!`)
        })
        .catch(err => {
          console.log('Erro ao comissionar', err)
        })
        .finally(() => {
          setReload(false)
        })
    }
  }

  const refreshListComissao = (token: string | undefined) => {
    if (token) {
      setReload(true)
      ContratoService.getComissao(token)
        .then(respComissaoList => {
          setComissaoList(respComissaoList)
        })
        .catch(err => {
          toast.error(trataErro(err))
        })
        .finally(() => {
          setReload(false)
        })
    }
  }

  //componenteInit
  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true

      ContratoService.get(token)
        .then(contratoResp => {
          if (contratoResp) {
            setContrato(contratoResp)
            refreshListComissao(contratoResp.token)
          }
        })
        .catch(err => {
          const msg = trataErro(err)

          toast.error(msg)
        })
        .finally(() => {})
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    contrato?.token && (
      <>
        <Card sx={{ mb: 2.5 }}>
          <CardHeader
            title={
              <>
                <span>
                  Extrato de comissão: {contrato.cliente?.nome} -{' '}
                  {moment(contrato?.data).utcOffset('+0300').format('DD/MM/YYYY')} - {contrato.token}
                </span>
                <Chip
                  size='small'
                  variant='tonal'
                  label={contrato.status ? getStatusContratoEnumDesc(contrato.status) : ''}
                  color={contrato.status ? getStatusContratoEnumColor(contrato.status) : 'default'}
                  sx={{ float: 'right' }}
                />
              </>
            }
          />
          <CardContent sx={{ p: theme => `${theme.spacing(3, 5.25, 4)} !important` }}>
            <Chip
              size='small'
              variant='tonal'
              label={`${contrato.prazo} meses`}
              color='primary'
              icon={<i className='tabler-calendar-repeat' />}
              sx={{ mr: 2.5 }}
            />
            <Chip
              size='small'
              variant='tonal'
              label={contrato?.taxaCliente ? valorBr.format(contrato?.taxaCliente) : ''}
              color='primary'
              icon={<i className='tabler-percentage' />}
              sx={{ mr: 2.5 }}
            />
            <Chip
              size='small'
              variant='tonal'
              label={contrato?.valor ? valorBr.format(contrato?.valor) : ''}
              color='primary'
              icon={<i className='tabler-currency-dollar' />}
              sx={{ mr: 2.5 }}
            />
            <span style={{ float: 'right', paddingRight: '10px', fontWeight: 'bolder' }}>
              Saldo: {contrato?.saldo ? valorEmReal.format(contrato.saldo) : '0,00'}
            </span>
            {contrato.saldoPendente && (
              <>
                <br />
                <small style={{ float: 'right', paddingRight: '10px', fontWeight: 'bolder' }}>
                  ( Pendente: {valorEmReal.format(contrato.saldoPendente)} )
                </small>
              </>
            )}
          </CardContent>
          <Backdrop open={reload} className='absolute text-white z-[cal(var(--mui-zIndex-mobileStepper)-1)]'>
            <CircularProgress color='inherit' />
          </Backdrop>
        </Card>

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label='extrato contrato'>
            <TableHead>
              <TableRow>
                <TableCell align='center'>ID</TableCell>
                <TableCell align='center'>Data</TableCell>
                <TableCell align='center'>Token</TableCell>
                <TableCell align='center'>Histórico</TableCell>
                <TableCell align='center'>Tipo</TableCell>
                <TableCell align='center'>Status</TableCell>
                <TableCell align='center'>Valor</TableCell>
                {(isMaster(session?.user) || isParceiroMaster(session?.user)) && (
                  <TableCell align='center'>Ações</TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {comissaoList.map(comissao => (
                <StyledTableRow key={comissao.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell component='th' scope='row' align='center'>
                    {comissao.id}
                  </TableCell>
                  <TableCell align='center'>
                    {comissao.extrato?.data ? moment(comissao.extrato?.data).format('DD-MM-YYYY HH:mm') : ''}
                  </TableCell>
                  <TableCell align='center'>{comissao.extrato?.token}</TableCell>
                  <TableCell align='center'>{comissao.extrato?.historico}</TableCell>
                  <TableCell align='center'>
                    <Chip
                      size='small'
                      label={comissao.tipoExtrato ? getTipoExtratoEnumDesc(comissao.tipoExtrato) : ''}
                      color={comissao.tipoExtrato ? getTipoExtratoEnumColor(comissao.tipoExtrato) : 'default'}
                      sx={{ fontSize: '12px', height: '20px' }}
                    />
                  </TableCell>
                  <TableCell align='center'>
                    <Chip
                      size='small'
                      label={comissao.extrato?.status ? getStatusContratoEnumDesc(comissao.extrato?.status) : ''}
                      color={
                        comissao.extrato?.status ? getStatusContratoEnumColor(comissao.extrato?.status) : 'default'
                      }
                    />
                  </TableCell>
                  <TableCell align='center'>
                    {comissao.valorExtrato ? valorBr.format(comissao?.valorExtrato) : ''}
                  </TableCell>
                  {(isMaster(session?.user) || isParceiroMaster(session?.user)) && (
                    <TableCell align='center'>
                      {/*
                      <IconButton
                        ariaComissionarbel='capture screenshot'
                        onClic)
                        }}
                      >
                        <i className='tabler-pencil' />
                      </IconButton>
                      <IconButton
                        aria-label='capture screenshot'
                        onClick={() => {
                          handleOnDeleteExtrato(extrato.token)
                        }}
                      >
                        <i className='tabler-trash' />
                      </IconButton>
                      */}
                    </TableCell>
                  )}
                </StyledTableRow>
              ))}
            </TableBody>
            <caption>
              <Button
                variant='contained'
                startIcon={<i className='tabler-arrow-back-up' />}
                onClick={() => window.history.back()}
                sx={{ float: 'left' }}
              >
                Voltar para a listagem
              </Button>
              <Button
                variant='contained'
                startIcon={<i className='tabler-plus' />}
                onClick={() => handleRefazerComissao()}
                sx={{ float: 'right' }}
              >
                Novo Aditivo
              </Button>
            </caption>
          </Table>
        </TableContainer>
        <Dialog maxWidth='sm' open={openDlgRefazerComissao} aria-labelledby='form-dialog-title' disableEscapeKeyDown>
          <DialogTitle id='form-dialog-title'>Refazer comissionamento de contrato</DialogTitle>
          <DialogContent>
            <p>Confirmar em refazer a comissão deste contrato?</p>
          </DialogContent>
          <DialogActions className='dialog-actions-dense'>
            <Button variant='contained' onClick={() => confirmComissionar()}>
              Refazer comissão
            </Button>
            <Button
              type='reset'
              variant='contained'
              onClick={() => {
                setOpenDlgRefazerComissao(false)
              }}
            >
              Cancelar
            </Button>
          </DialogActions>
        </Dialog>
      </>
    )
  )
}
