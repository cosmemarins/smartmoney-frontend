'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'

// Component Imports
import { Button, Dialog, DialogContent, DialogTitle } from '@mui/material'

// Component Imports
import type { ContratoType } from '@/types/ContratoType'
import { contratoInit } from '@/types/ContratoType'
import ExtratoContrato from './ExtratoContrato'
import ContratoEdit from './ContratoEdit'
import ContratoItemList from './ContratoItemList'

const Contratos = () => {
  // States
  const [contratoSelect, setContratoSelect] = useState<ContratoType>(contratoInit)
  const [openDlgContrato, setOpenDlgContrato] = useState<boolean>(false)

  const handleClickOpenDlgContrato = () => setOpenDlgContrato(true)

  const handleCloseDlgContrato = () => setOpenDlgContrato(false)

  const handleOnSelect = (contrato: ContratoType) => {
    setContratoSelect(contrato)
  }

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
              <ContratoItemList handleOnSelect={handleOnSelect} />
            </Grid>
            <Grid item xs={12} md={8}>
              <Card>
                {contratoSelect.token && contratoSelect.token != '' && <ExtratoContrato contrato={contratoSelect} />}
              </Card>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Dialog
        maxWidth='md'
        open={openDlgContrato}
        aria-labelledby='form-dialog-title'
        disableEscapeKeyDown
        onClose={(event, reason) => {
          if (reason !== 'backdropClick') {
            handleCloseDlgContrato()
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
