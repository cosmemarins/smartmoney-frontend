// MUI Imports
import { useEffect, useState } from 'react'

import Grid from '@mui/material/Grid'

// Component Imports
import { Button, Card, CardContent, CardHeader, Dialog, DialogContent, DialogTitle } from '@mui/material'

import { toast } from 'react-toastify'

import { useClienteContext } from '@/contexts/ClienteContext'

import DocumentoContratoEdit from '../../components/DocumentoContratoEdit'
import type { ArquivoType } from '@/types/ArquivoType'
import { trataErro } from '@/utils/erro'
import ArquivoItem from './ArquivoItem'

import DirectionalIcon from '@/components/DirectionalIcon'
import { TipoArquivoRegistroEnum } from '@/utils/enums/TipoArquivoRegistroEnum'
import { useContratoContext } from '@/contexts/ContratoContext'
import { TipoDocumentoEnum } from '@/utils/enums/TipoDocumentoEnum'
import type { ExtratoType } from '@/types/ExtratoType'
import ExtratoService from '@/services/ExtratoService'
import ContratoService from '@/services/ContratoService'

type Props = {
  activeStep: number
  handleNext: () => void
  handlePrev: () => void
  steps: { title: string; subtitle: string }[]
}

const Documentacao = ({ activeStep, handleNext, handlePrev, steps }: Props) => {
  //contexto
  const { cliente, setLoadingContext } = useClienteContext()
  const { contrato } = useContratoContext()

  const [openDlgArquivo, setOpenDlgArquivo] = useState<boolean>(false)
  const [tituloDlgArquivo, setTituloDlgArquivo] = useState('Novo Upload de Arquivo')
  const [arquivoList, setArquivoList] = useState<ArquivoType[]>([])
  const [refreshArquivoList, setRefreshArquivoList] = useState<boolean>(true)

  const arquivoInit = {
    data: new Date(),
    tipoRegistro: TipoArquivoRegistroEnum.CLIENTE,
    idRegistro: cliente?.id,
    tokenRegistro: cliente?.token,
    cliente: {
      id: cliente?.id,
      token: cliente?.token,
      tipoPessoa: cliente?.tipoPessoa
    }
  }

  const [arquivoEdit, setArquivoEdit] = useState<ArquivoType>(arquivoInit)

  const extratoInit = {
    data: new Date(),
    contrato: { id: contrato?.id, token: contrato?.token },
    tipo: TipoDocumentoEnum.APORTE,
    valor: contrato?.valor,
    arquivo: {
      tipoDocumento: TipoDocumentoEnum.APORTE
    }
  }

  console.log('extratoInit', extratoInit)
  const [extratoEdit, setExtratoEdit] = useState<ExtratoType>(extratoInit)

  const handleNovoArquivo = () => {
    setTituloDlgArquivo('Novo documento para este contrato')
    setArquivoEdit(arquivoInit)
    setOpenDlgArquivo(true)
  }

  const handleEditArquivo = (arquivo: ArquivoType) => {
    setTituloDlgArquivo('Edição de Arquivo')
    setArquivoEdit(arquivo)

    if (arquivo.idRegistro && arquivo.tipoDocumento === TipoDocumentoEnum.APORTE) {
      ExtratoService.getById(Number(arquivo.idRegistro))
        .then(respExtrato => {
          setExtratoEdit({
            ...respExtrato,
            contrato: { id: contrato?.id, token: contrato?.token }
          })
          setArquivoEdit({
            ...arquivo,
            descricao: respExtrato.historico
          })
          setOpenDlgArquivo(true)
        })
        .catch(err => {
          toast.error(trataErro(err))
        })
    } else {
      setOpenDlgArquivo(true)
    }
  }

  const handleCloseDlgArquivo = () => {
    setOpenDlgArquivo(false)
  }

  useEffect(() => {
    setRefreshArquivoList(false)

    if (contrato?.token) {
      setLoadingContext(true)

      //precisa recuperar por aqui pois tem que ser via axios por causa da validação de seção
      ContratoService.listDocumentos(contrato.token)
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
                    {arquivo.tipoDocumento === TipoDocumentoEnum.APORTE ? (
                      <ArquivoItem
                        arquivo={{
                          ...arquivo,
                          tipoRegistro: TipoArquivoRegistroEnum.CLIENTE,

                          //tokenRegistro: cliente?.token, //esse token tem que ser do extrato, mas não tem extrato aqui
                          cliente: { id: cliente?.id, token: cliente?.token, tipoPessoa: cliente?.tipoPessoa }
                        }}
                        handleEditArquivo={handleEditArquivo}
                      />
                    ) : (
                      <ArquivoItem
                        arquivo={{
                          ...arquivo,
                          tokenRegistro: cliente?.token,
                          cliente: { id: cliente?.id, token: cliente?.token, tipoPessoa: cliente?.tipoPessoa }
                        }}
                        handleEditArquivo={handleEditArquivo}
                      />
                    )}
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
              {activeStep === steps.length - 1 ? 'Enviar Contrato' : 'Próximo'}
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
          <DocumentoContratoEdit
            arquivoData={arquivoEdit}
            extratoData={extratoEdit}
            handleClose={handleCloseDlgArquivo}
            setRefresh={setRefreshArquivoList}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}

export default Documentacao
