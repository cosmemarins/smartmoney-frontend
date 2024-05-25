// React Imports
import { useEffect, useState } from 'react'

import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'

import type { DialogConfirmaType } from '@/types/utilTypes'

interface props {
  dialogConfirmaOptions: DialogConfirmaType
}

const DialogConfirma = ({ dialogConfirmaOptions }: props) => {
  const [openDlgConfirma, setOpenDlgConfirma] = useState<DialogConfirmaType>(dialogConfirmaOptions)

  const handleConfirma = () => {
    setOpenDlgConfirma({ open: false })
    dialogConfirmaOptions.handleConfirma()
  }

  useEffect(() => {
    setOpenDlgConfirma(dialogConfirmaOptions)
  }, [dialogConfirmaOptions])

  return (
    <Dialog maxWidth='sm' open={openDlgConfirma.open} aria-labelledby='form-dialog-title' disableEscapeKeyDown>
      <DialogTitle id='form-dialog-title'>{dialogConfirmaOptions.titulo}</DialogTitle>
      <DialogContent>{dialogConfirmaOptions.texto}</DialogContent>
      <DialogActions className='dialog-actions-dense'>
        <Button
          variant='contained'
          onClick={() => {
            handleConfirma()
          }}
        >
          {dialogConfirmaOptions.botaoConfirma ? dialogConfirmaOptions.botaoConfirma : 'Confirmar'}
        </Button>
        <Button
          type='reset'
          variant='tonal'
          color='secondary'
          onClick={() => {
            setOpenDlgConfirma({ open: false })
          }}
        >
          Cancelar
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DialogConfirma
