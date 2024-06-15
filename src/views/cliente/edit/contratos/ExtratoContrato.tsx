import { useEffect, useState } from 'react'

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
import OptionMenu from '@/components/option-menu'
import { useContratoContext } from '@/contexts/ContratoContext'
import ContratoEdit from './ContratoEdit'
import { trataErro } from '@/utils/erro'

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

export default function ExtratoContrato() {
  // States
  const [extratoEdit, setExtratoEdit] = useState<ExtratoType>({} as ExtratoType)
  const [extratoList, setExtratoList] = useState<ExtratoType[]>([])
  const [reload, setReload] = useState(false)
  const [openDlgContrato, setOpenDlgContrato] = useState<boolean>(false)
  const [openDlgExtrato, setOpenDlgExtrato] = useState<boolean>(false)
  const [openDlgDeleteExtrato, setOpenDlgDeleteExtrato] = useState<boolean>(false)
  const [itemSelect, setItemSelect] = useState<string | undefined>()

  const { contrato, setContratoContext, setRefreshContext } = useContratoContext()

  const menuOptions = [
    {
      text: 'Refresh',
      icon: 'tabler-refresh text-[22px]',
      menuItemProps: {
        onClick: () => {
          refreshListExtrato(contrato?.token)
          setRefreshContext(true)
        },
        className: 'flex items-center gap-2 text-textSecondary'
      }
    },
    {
      text: 'Editar Contrato',
      icon: 'tabler-edit text-[22px]',
      menuItemProps: {
        onClick: () => {
          handleClickOpenDlgContrato()
        },
        className: 'flex items-center gap-2 text-textSecondary'
      }
    },
    {
      text: 'Enviar Contrato',
      icon: 'tabler-send text-[22px]',
      menuItemProps: { className: 'flex items-center gap-2 text-textSecondary' }
    },
    {
      divider: true
    }
  ]

  const handleClickOpenDlgContrato = () => setOpenDlgContrato(true)

  const handleCloseDlgContrato = (refresh: boolean) => {
    setOpenDlgContrato(false)

    if (refresh) {
      refreshContrato(contrato?.token)
      setRefreshContext(true)
    }
  }

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
      refreshContrato(contrato?.token)
      refreshListExtrato(contrato?.token)
      setRefreshContext(true)
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
          refreshContrato(contrato?.token)
          refreshListExtrato(contrato?.token)
          setRefreshContext(true)
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

  const refreshContrato = (token: string | undefined) => {
    console.log('refreshContrato', token)

    if (token) {
      setReload(true)
      ContratoService.get(token)
        .then(respContrato => {
          setContratoContext(respContrato)
        })
        .catch(err => {
          trataErro(err)
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
          setExtratoList(respExtratoList)
        })
        .catch(err => {
          trataErro(err)
        })
        .finally(() => {
          setReload(false)
        })
    }
  }

  //componenteInit
  useEffect(() => {
    console.log('useEffect ExtratoContrato, []')
    refreshListExtrato(contrato?.token)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    console.log('useEffect ExtratoContrato, [contrato] ')
    setRefreshContext(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contrato])

  return (
    contrato?.token && (
      <>
        <Card sx={{ mb: 2.5 }}>
          <CardHeader
            title={
              <>
                <span>
                  {moment(contrato?.data).format('DD/MM/YYYY')} - {contrato.token}
                </span>
                <span style={{ float: 'right', paddingRight: '10px' }}>
                  {contrato.saldo ? valorEmReal.format(contrato.saldo) : '0,00'}
                </span>
              </>
            }
            action={<OptionMenu options={menuOptions} />}
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
              label={contrato?.taxa ? valorBr.format(contrato?.taxa) : ''}
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
            <Chip
              size='small'
              variant='tonal'
              label={contrato.status ? getStatusContratoEnumDesc(contrato.status) : ''}
              color={contrato.status ? getStatusContratoEnumColor(contrato.status) : 'default'}
              sx={{ float: 'right' }}
            />
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
            <caption style={{ textAlign: 'right', fontWeight: 'bold' }}>
              <Button variant='contained' startIcon={<i className='tabler-plus' />} onClick={() => handleNovoExtrato()}>
                Novo Lançamento
              </Button>
            </caption>
          </Table>
        </TableContainer>

        <Dialog
          maxWidth='md'
          open={openDlgContrato}
          aria-labelledby='form-dialog-title'
          disableEscapeKeyDown
          onClose={(event, reason) => {
            if (reason !== 'backdropClick') {
              handleCloseDlgContrato(false)
            }
          }}
        >
          <DialogTitle id='form-dialog-title'>Editar Contrato</DialogTitle>
          <DialogContent>
            <ContratoEdit contrato={contrato} handleClose={handleCloseDlgContrato} />
          </DialogContent>
        </Dialog>

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
