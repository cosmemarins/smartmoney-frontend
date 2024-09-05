// MUI Imports
import { useEffect, useState } from 'react'

import Grid from '@mui/material/Grid'

// Component Imports
import { Button, Card, CardContent, CardHeader, Dialog, DialogContent, DialogTitle } from '@mui/material'

import { toast } from 'react-toastify'

import { useClienteContext } from '@/contexts/ClienteContext'

import ArquivoEdit from './ArquivoEdit'
import type { ArquivoType } from '@/types/ArquivoType'
import ArquivoService from '@/services/ArquivoService'
import { trataErro } from '@/utils/erro'
import ArquivoItem from './ArquivoItem'
import { TipoArquivoRegistroEnum } from '@/utils/enums/TipoArquivoRegistroEnum'

const DocumentacaoTab = () => {
  //contexto
  const { cliente, setLoadingContext } = useClienteContext()

  const [openDlgArquivo, setOpenDlgArquivo] = useState<boolean>(false)
  const [tituloDlgArquivo, setTituloDlgArquivo] = useState('Novo Upload de Arquivo')
  const [arquivoList, setArquivoList] = useState<ArquivoType[]>([])
  const [refreshArquivoList, setRefreshArquivoList] = useState<boolean>(true)

  const arquivoInit = {
    data: new Date(),
    tipoRegistro: TipoArquivoRegistroEnum.CLIENTE,
    idRegistro: cliente?.id,
    cliente: { id: cliente?.id, token: cliente?.token, tipoPessoa: cliente?.tipoPessoa }
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

    if (cliente?.token) {
      setLoadingContext(true)

      //precisa recuperar por aqui pois tem que ser via axios por causa da validação de seção
      ArquivoService.getListCliente(cliente.token)
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
      <Card>
        <CardHeader
          title='Documentação'
          action={
            <Button variant='contained' startIcon={<i className='tabler-plus' />} onClick={() => handleNovoArquivo()}>
              Upload Arquivo
            </Button>
          }
        />
        <CardContent className='flex flex-col gap-4'>
          <Grid container spacing={4}>
            {arquivoList.map((arquivo, key) => (
              <Grid key={key} item xs={12} sm={4}>
                <ArquivoItem
                  arquivo={{ ...arquivo, cliente: { id: cliente?.id, token: cliente?.token } }}
                  handleEditArquivo={handleEditArquivo}
                />
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
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

export default DocumentacaoTab
