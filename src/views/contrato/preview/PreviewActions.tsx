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
  const { resumoContrato, setResumoContratoContext } = useContratoContext()

  //state
  const [dialogConfirma, setDialogConfirma] = useState<DialogConfirmaType>({ open: false })

  const handleOpenDlgConfirmaEnviar = () => {
    if (resumoContrato?.podeEnviar) {
      setDialogConfirma({
        open: true,
        titulo: 'Enviar Contrato',
        texto: 'Confirma o envio deste contrato?',
        botaoConfirma: 'Confirmar Envio',
        handleConfirma: handleEnviarContrato
      })
    } else {
      toast.success('Contrato salvo com sucesso!')
      setContratoContext({})
      setResumoContratoContext(undefined)
      window.location.reload()
    }
  }

  const handleEnviarContrato = () => {
    if (contrato && contrato.token) {
      ContratoService.enviarContrato(contrato.token)
        .then(() => {
          //console.log('respContrato', respContrato)
          toast.success('Contrato enviado!')
          setContratoContext({})
          setResumoContratoContext(undefined)
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
              startIcon={<i className='tabler-printer' />}
              href={`./print/${contrato?.token}`}
            >
              Print
            </Button>
            <Button
              fullWidth
              variant='contained'
              startIcon={
                resumoContrato?.podeEnviar ? <i className='tabler-send' /> : <i className='tabler-file-filled' />
              }
              onClick={() => handleOpenDlgConfirmaEnviar()}
            >
              {resumoContrato?.podeEnviar ? 'Salvar e enviar contrato' : 'Salvar'}
            </Button>
          </div>
        </CardContent>
      </Card>
      <DialogConfirma dialogConfirmaOptions={dialogConfirma} />
    </>
  )
}

export default PreviewActions
