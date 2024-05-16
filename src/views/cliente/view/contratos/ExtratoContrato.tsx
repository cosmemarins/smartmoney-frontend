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
  Chip,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  styled
} from '@mui/material'

import type { ContratoType } from '@/types/ContratoType'
import ContratoService from '@/services/ContratoService'
import type { ExtratoType } from '@/types/ExtratoType'
import { valorBr, valorEmReal } from '@/utils/string'
import { getStatusContratoEnumColor, getStatusContratoEnumDesc } from '@/utils/enums/StatusContratoEnum'
import { getTipoExtratoEnumColor, getTipoExtratoEnumDesc } from '@/utils/enums/TipoExtratoEnum'
import ExtratoEdit from './ExtratoEdit'

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
  contrato: ContratoType
}

export default function ExtratoContrato({ contrato }: props) {
  // States
  const [extratoList, setExtratoList] = useState<ExtratoType[]>([])
  const [extratoEdit, setExtratoEdit] = useState<ExtratoType>({ data: new Date(), contrato })
  const [reload, setReload] = useState(false)
  const [reloadExtrato, setReloadExtrato] = useState(false)
  const [openDlgExtrato, setOpenDlgExtrato] = useState<boolean>(false)

  const handleClickOpenDlgExtrato = () => setOpenDlgExtrato(true)

  const handleCloseDlgExtrato = () => {
    setOpenDlgExtrato(false)
    setReloadExtrato(true)
  }

  useEffect(() => {
    setReloadExtrato(false)

    if (contrato?.token) {
      setReload(true)
      setExtratoEdit({
        data: new Date(),
        contrato: contrato
      })
      ContratoService.getExtrato(contrato.token)
        .then(respExtratoList => {
          setExtratoList(respExtratoList)
        })
        .catch(err => {
          console.log('ERRO RESP', err)
        })
        .finally(() => {
          setReload(false)
        })
    }
  }, [contrato.token, reloadExtrato])

  return (
    <>
      <Card sx={{ mb: 2.5 }}>
        <CardContent sx={{ p: theme => `${theme.spacing(3, 5.25, 4)} !important` }}>
          <Typography variant='h6' sx={{ mb: 2 }}>
            <span>{moment(contrato?.data).format('DD/MM/YYYY')}</span> - <span className='small'>{contrato.token}</span>
            <span style={{ float: 'right' }}>{contrato.valor ? valorEmReal.format(contrato.valor) : ''}</span>
          </Typography>
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
                  <IconButton aria-label='capture screenshot'>
                    <i className='tabler-pencil' />
                  </IconButton>
                  <IconButton aria-label='capture screenshot'>
                    <i className='tabler-trash' />
                  </IconButton>
                </TableCell>
              </StyledTableRow>
            ))}
          </TableBody>
          <caption style={{ textAlign: 'right', fontWeight: 'bold' }}>
            <Button
              variant='contained'
              startIcon={<i className='tabler-plus' />}
              onClick={() => handleClickOpenDlgExtrato()}
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
            handleCloseDlgExtrato()
          }
        }}
      >
        <DialogTitle id='form-dialog-title'>Novo Lançamento</DialogTitle>
        <DialogContent>
          <ExtratoEdit extratoData={extratoEdit} handleClose={handleCloseDlgExtrato} />
        </DialogContent>
      </Dialog>
    </>
  )
}
