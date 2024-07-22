'use client'

// Next Imports
import { useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'

import { toast } from 'react-toastify'

import type { DialogConfirmaType } from '@/types/utilTypes'
import DialogConfirma from '@/components/DialogConfirma'
import { trataErro } from '@/utils/erro'

// Component Imports
import { useContratoContext } from '@/contexts/ContratoContext'
import ContratoService from '@/services/ContratoService'

const PreviewActions = () => {
  // context
  const { contrato, setContratoContext } = useContratoContext()

  //state
  const [dialogConfirma, setDialogConfirma] = useState<DialogConfirmaType>({ open: false })

  const handleOpenDlgConfirmaEnviar = () => {
    setDialogConfirma({
      open: true,
      titulo: 'Enviar Contrato',
      texto: 'Confirma o envio deste contrato?',
      botaoConfirma: 'Confirmar Envio',
      handleConfirma: handleEnviarContrato
    })
  }

  const handleEnviarContrato = () => {
    if (contrato && contrato.token) {
      ContratoService.enviarContrato(contrato.token)
        .then(() => {
          //console.log('respContrato', respContrato)
          toast.success('Contrato enviado!')
          setContratoContext({})
          window.location.reload()
          setDialogConfirma({
            open: false
          })
        })
        .catch(err => {
          toast.error(trataErro(err))
        })
        .finally(() => {})
    }
  }

  return (
    <>
      <Card>
        <CardContent className='flex flex-col gap-4'>
          <div className='flex items-center gap-4'>
            <Button
              fullWidth
              color='secondary'
              variant='tonal'
              startIcon={<i className='tabler-file-filled' />}
              onClick={() => toast.success('Contrato salvo com sucesso')}
            >
              Salvar
            </Button>
            <Button
              fullWidth
              color='secondary'
              variant='tonal'
              startIcon={<i className='tabler-printer' />}
              href={`./print/${contrato?.token}`}
            >
              Print
            </Button>
            <Button
              fullWidth
              variant='contained'
              startIcon={<i className='tabler-send' />}
              onClick={() => handleOpenDlgConfirmaEnviar()}
            >
              Enviar contrato
            </Button>
          </div>
        </CardContent>
      </Card>
      <DialogConfirma dialogConfirmaOptions={dialogConfirma} />
    </>
  )
}

export default PreviewActions
