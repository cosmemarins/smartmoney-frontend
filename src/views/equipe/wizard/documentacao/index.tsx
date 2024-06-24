// MUI Imports
import { useEffect, useState } from 'react'

import Grid from '@mui/material/Grid'

// Component Imports
import { Button, Card, CardContent, CardHeader, Dialog, DialogContent, DialogTitle } from '@mui/material'

import { toast } from 'react-toastify'

import { useUsuarioContext } from '@/contexts/UsuarioContext'

import ArquivoEdit from './ArquivoEdit'
import type { ArquivoType } from '@/types/ArquivoType'
import ArquivoService from '@/services/ArquivoService'
import { trataErro } from '@/utils/erro'
import ArquivoItem from './ArquivoItem'

import DirectionalIcon from '@/components/DirectionalIcon'

type Props = {
  activeStep: number
  handleNext: () => void
  handlePrev: () => void
  steps: { title: string; subtitle: string }[]
}

const Documentacao = ({ activeStep, handleNext, handlePrev, steps }: Props) => {
  //contexto
  const { usuario, setLoadingContext } = useUsuarioContext()

  const [openDlgArquivo, setOpenDlgArquivo] = useState<boolean>(false)
  const [tituloDlgArquivo, setTituloDlgArquivo] = useState('Novo Upload de Arquivo')
  const [arquivoList, setArquivoList] = useState<ArquivoType[]>([])
  const [refreshArquivoList, setRefreshArquivoList] = useState<boolean>(true)

  const arquivoInit = {
    data: new Date(),
    tipoUsuario: 'U',
    idUsuario: usuario?.id,
    usuario: { id: usuario?.id, token: usuario?.token }
  }

  const [arquivoEdit, setArquivoEdit] = useState<ArquivoType>(arquivoInit)

  const handleNovoArquivo = () => {
    setTituloDlgArquivo('Novo Upload de Arquivo')
    setArquivoEdit(arquivoInit)
    setOpenDlgArquivo(true)
  }

  const handleEditArquivo = (arquivo: ArquivoType) => {
    setTituloDlgArquivo('Edição de Arquivo')
    setArquivoEdit(arquivo)
    setOpenDlgArquivo(true)
  }

  const handleCloseDlgArquivo = () => {
    setOpenDlgArquivo(false)
  }

  useEffect(() => {
    setRefreshArquivoList(false)

    if (usuario?.token) {
      setLoadingContext(true)

      //precisa recuperar por aqui pois tem que ser via axios por causa da validação de seção
      ArquivoService.getListUsuario(usuario.token)
        .then(respList => {
          setArquivoList(respList)
        })
        .catch(err => {
          toast.error(trataErro(err))
        })
        .finally(() => {
          setLoadingContext(false)
        })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshArquivoList])

  return (
    <>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <CardHeader
              title='Documentação'
              action={
                <Button
                  variant='contained'
                  startIcon={<i className='tabler-plus' />}
                  onClick={() => handleNovoArquivo()}
                >
                  Upload Arquivo
                </Button>
              }
            />
            <CardContent className='flex flex-col gap-4'>
              <Grid container spacing={4}>
                {arquivoList.map((arquivo, key) => (
                  <Grid key={key} item xs={12} sm={4}>
                    <ArquivoItem
                      arquivo={{ ...arquivo, usuario: { id: usuario?.id, token: usuario?.token } }}
                      handleEditArquivo={handleEditArquivo}
                    />
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <div className='flex items-center justify-between'>
            <Button
              variant='tonal'
              color='secondary'
              disabled={activeStep === 0}
              onClick={handlePrev}
              startIcon={<DirectionalIcon ltrIconClass='tabler-arrow-left' rtlIconClass='tabler-arrow-right' />}
            >
              Anterior
            </Button>
            <Button
              variant='contained'
              color={activeStep === steps.length - 1 ? 'success' : 'primary'}
              onClick={handleNext}
              endIcon={
                activeStep === steps.length - 1 ? (
                  <i className='tabler-check' />
                ) : (
                  <DirectionalIcon ltrIconClass='tabler-arrow-right' rtlIconClass='tabler-arrow-left' />
                )
              }
            >
              {activeStep === steps.length - 1 ? 'Salvar Parceiro' : 'Próximo'}
            </Button>
          </div>
        </Grid>
      </Grid>
      <Dialog
        maxWidth='md'
        open={openDlgArquivo}
        aria-labelledby='form-dialog-title'
        disableEscapeKeyDown
        onClose={(event, reason) => {
          if (reason !== 'backdropClick') {
            handleCloseDlgArquivo()
          }
        }}
      >
        <DialogTitle id='form-dialog-title'>{tituloDlgArquivo}</DialogTitle>
        <DialogContent>
          <ArquivoEdit
            arquivoData={arquivoEdit}
            handleClose={handleCloseDlgArquivo}
            setRefreshArquivoList={setRefreshArquivoList}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}

export default Documentacao
