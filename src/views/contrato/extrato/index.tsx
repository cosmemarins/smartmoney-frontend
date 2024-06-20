'use client'

import { useEffect, useRef, useState } from 'react'

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
  IconButton,
  styled
} from '@mui/material'

import { toast } from 'react-toastify'

import ContratoService from '@/services/ContratoService'
import type { ExtratoType } from '@/types/ExtratoType'
import { valorBr, valorEmReal } from '@/utils/string'
import { getStatusContratoEnumColor, getStatusContratoEnumDesc } from '@/utils/enums/StatusContratoEnum'
import { getTipoExtratoEnumColor, getTipoExtratoEnumDesc } from '@/utils/enums/TipoExtratoEnum'
import ExtratoEdit from './ExtratoEdit'
import { trataErro } from '@/utils/erro'
import type { ContratoType } from '@/types/ContratoType'

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

export default function ExtratoContrato({ token }: props) {
  // States
  const [contrato, setContrato] = useState<ContratoType>()
  const [extratoEdit, setExtratoEdit] = useState<ExtratoType>({} as ExtratoType)
  const [extratoList, setExtratoList] = useState<ExtratoType[]>([])
  const [reload, setReload] = useState(false)
  const [openDlgExtrato, setOpenDlgExtrato] = useState<boolean>(false)
  const [openDlgDeleteExtrato, setOpenDlgDeleteExtrato] = useState<boolean>(false)
  const [itemSelect, setItemSelect] = useState<string | undefined>()

  // Refs
  const initialized = useRef(false)

  const handleNovoExtrato = () => {
    if (contrato) {
      setExtratoEdit({
        data: new Date(),
        contrato: { id: contrato.id, token: contrato.token }
      })
      setOpenDlgExtrato(true)
    }
  }

  const handleCloseDlgExtrato = (refresh: boolean) => {
    setOpenDlgExtrato(false)

    if (refresh) {
      refreshListExtrato(contrato?.token)
    }
  }

  const handleOnEditExtrato = (extrato: ExtratoType) => {
    if (extrato.token) {
      setExtratoEdit(extrato)
      setOpenDlgExtrato(true)
    }
  }

  const handleOnDeleteExtrato = (token: string | undefined) => {
    if (token) {
      setItemSelect(token)
      setOpenDlgDeleteExtrato(true)
    }
  }

  const confirmDeleteExtrato = () => {
    if (contrato && itemSelect) {
      setReload(true)
      ContratoService.excluirExtrato(itemSelect)
        .then(() => {
          refreshListExtrato(contrato?.token)
          setOpenDlgDeleteExtrato(false)
          toast.success(`Lançamento ${itemSelect} excluído com sucesso!`)
        })
        .catch(err => {
          console.log('Erro ao excluir', err)
        })
        .finally(() => {
          setReload(false)
        })
    }
  }

  const refreshListExtrato = (token: string | undefined) => {
    if (token) {
      setReload(true)
      ContratoService.getExtrato(token)
        .then(respExtratoList => {
          console.log('respExtratoList', respExtratoList)

          setExtratoList(respExtratoList)
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
            refreshListExtrato(contratoResp.token)
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
                  {contrato.cliente?.nome} - {moment(contrato?.data).format('DD/MM/YYYY')} - {contrato.token}
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
              Saldo: {contrato.saldo ? valorEmReal.format(contrato.saldo) : '0,00'}
            </span>
          </CardContent>
          <Backdrop open={reload} className='absolute text-white z-[cal(var(--mui-zIndex-mobileStepper)-1)]'>
            <CircularProgress color='inherit' />
          </Backdrop>
        </Card>

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label='extrato contrato'>
            <TableHead>
              <TableRow>
                <TableCell align='center'>#</TableCell>
                <TableCell align='center'>Data</TableCell>
                <TableCell align='center'>Token</TableCell>
                <TableCell align='center'>Histórico</TableCell>
                <TableCell align='center'>Tipo</TableCell>
                <TableCell align='center'>Valor</TableCell>
                <TableCell align='center'>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {extratoList.map(extrato => (
                <StyledTableRow key={extrato.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell component='th' scope='row' align='center'>
                    {extrato.id}
                  </TableCell>
                  <TableCell align='center'>
                    {extrato?.data ? moment(extrato?.data).format('DD-MM-YYYY HH:mm') : ''}
                  </TableCell>
                  <TableCell align='center'>{extrato.token}</TableCell>
                  <TableCell align='center'>{extrato.historico}</TableCell>
                  <TableCell align='center'>
                    <Chip
                      size='small'
                      label={extrato?.tipo ? getTipoExtratoEnumDesc(extrato?.tipo) : ''}
                      color={extrato?.tipo ? getTipoExtratoEnumColor(extrato?.tipo) : 'default'}
                      sx={{ fontSize: '12px', height: '20px' }}
                    />
                  </TableCell>
                  <TableCell align='center'>{extrato?.valor ? valorBr.format(extrato?.valor) : ''}</TableCell>
                  <TableCell align='center'>
                    <IconButton
                      aria-label='capture screenshot'
                      onClick={() => {
                        handleOnEditExtrato(extrato)
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
                  </TableCell>
                </StyledTableRow>
              ))}
            </TableBody>
            <caption>
              <Button
                variant='tonal'
                color='secondary'
                startIcon={<i className='tabler-arrow-back-up' />}
                onClick={() => window.history.back()}
                sx={{ float: 'left' }}
              >
                Voltar para a listagem
              </Button>
              <Button
                variant='contained'
                startIcon={<i className='tabler-plus' />}
                onClick={() => handleNovoExtrato()}
                sx={{ float: 'right' }}
              >
                Novo Lançamento
              </Button>
            </caption>
          </Table>
        </TableContainer>

        <Dialog
          maxWidth='md'
          open={openDlgExtrato}
          aria-labelledby='form-dialog-title'
          disableEscapeKeyDown
          onClose={(event, reason) => {
            if (reason !== 'backdropClick') {
              handleCloseDlgExtrato(false)
            }
          }}
        >
          <DialogTitle id='form-dialog-title'>Novo Lançamento</DialogTitle>
          <DialogContent>
            <ExtratoEdit extratoData={extratoEdit} handleClose={handleCloseDlgExtrato} />
          </DialogContent>
        </Dialog>

        <Dialog maxWidth='sm' open={openDlgDeleteExtrato} aria-labelledby='form-dialog-title' disableEscapeKeyDown>
          <DialogTitle id='form-dialog-title'>Atenção ao excluir lançamento</DialogTitle>
          <DialogContent>
            <p>Ao excluir este lançamento, o comprovante também será excluído.</p>
            <p>Tem certeza que deseja excluir o lançamento: {itemSelect}?</p>
          </DialogContent>
          <DialogActions className='dialog-actions-dense'>
            <Button variant='contained' onClick={() => confirmDeleteExtrato()}>
              Confirmar Exclusão
            </Button>
            <Button
              type='reset'
              variant='tonal'
              color='secondary'
              onClick={() => {
                setOpenDlgDeleteExtrato(false)
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
