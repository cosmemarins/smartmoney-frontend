// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'

// Component Imports
import { Backdrop, Button, CircularProgress, Dialog, DialogContent, DialogTitle } from '@mui/material'

import type { ContratoType } from '@/types/ContratoType'
import { contratoInit } from '@/types/ContratoType'
import ExtratoContrato from './ExtratoContrato'
import ContratoEdit from './ContratoEdit'
import ContratoItemList from './ContratoItemList'
import ContratoService from '@/services/ContratoService'
import { useClienteContext } from '@/contexts/ClienteContext'

const Contratos = () => {
  console.log('renderizando contratos')

  // States
  const [contratoList, setContratoList] = useState<ContratoType[]>([])
  const [contratoSelect, setContratoSelect] = useState<ContratoType>(contratoInit)
  const [openDlgContrato, setOpenDlgContrato] = useState<boolean>(false)
  const [reload, setReload] = useState(false)

  const { cliente } = useClienteContext()

  const handleClickOpenDlgContrato = () => setOpenDlgContrato(true)

  const handleCloseDlgContrato = (refresh: boolean) => {
    setOpenDlgContrato(false)
    if (refresh) refreshContratoList()
  }

  const handleOnSelect = (contrato: ContratoType) => {
    console.log('Selecionou: ', contrato.token)
    setContratoSelect(contrato)
  }

  const refreshContratoList = () => {
    console.log('atualizando contrato list')

    if (cliente?.token) {
      ContratoService.getList(cliente.token)
        .then(respContratoList => {
          setContratoList(respContratoList)
        })
        .catch(err => {
          console.log('ERRO RESP', err)
        })
        .finally(() => {
          setReload(false)
        })
    }
  }

  useEffect(() => {
    console.log('useEffect Contratos, []')
    setReload(true)
    refreshContratoList()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <Card>
        <CardHeader
          title='Contratos'
          action={
            <Button variant='contained' startIcon={<i className='tabler-plus' />} onClick={handleClickOpenDlgContrato}>
              Novo Contrato
            </Button>
          }
        />
        <CardContent className='flex flex-col gap-4'>
          <Grid container spacing={6}>
            <Grid item xs={12} md={4}>
              <ContratoItemList handleOnSelect={handleOnSelect} contratoList={contratoList} />
            </Grid>
            <Grid item xs={12} md={8}>
              <Card>
                {contratoSelect.token && contratoSelect.token != '' && (
                  <ExtratoContrato contrato={contratoSelect} refreshContratoList={refreshContratoList} />
                )}
              </Card>
            </Grid>
          </Grid>
        </CardContent>
        <Backdrop open={reload} className='absolute text-white z-[cal(var(--mui-zIndex-mobileStepper)-1)]'>
          <CircularProgress color='inherit' />
        </Backdrop>
      </Card>
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
        <DialogTitle id='form-dialog-title'>Novo Contrato</DialogTitle>
        <DialogContent>
          <ContratoEdit handleClose={handleCloseDlgContrato} />
        </DialogContent>
      </Dialog>
    </>
  )
}

export default Contratos
