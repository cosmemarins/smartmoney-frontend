// MUI Imports
import { useEffect, useState } from 'react'

import Grid from '@mui/material/Grid'

// Component Imports
import { Button, Card, CardContent, CardHeader, Dialog, DialogContent, DialogTitle } from '@mui/material'

import { toast } from 'react-toastify'

import DocumentoContratoEdit from '../../components/DocumentoContratoEdit'
import type { ArquivoType } from '@/types/ArquivoType'
import { trataErro } from '@/utils/erro'
import ArquivoItem from './ArquivoItem'

import { TipoArquivoRegistroEnum } from '@/utils/enums/TipoArquivoRegistroEnum'
import { TipoDocumentoEnum } from '@/utils/enums/TipoDocumentoEnum'
import type { ExtratoType } from '@/types/ExtratoType'
import ExtratoService from '@/services/ExtratoService'
import ContratoService from '@/services/ContratoService'
import type { ContratoType } from '@/types/ContratoType'
import type { ClienteType } from '@/types/ClienteType'

type Props = {
  contrato: ContratoType
  cliente?: ClienteType
}

const Documentacao = ({ contrato, cliente }: Props) => {
  //contexto
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
      //precisa recuperar por aqui pois tem que ser via axios por causa da validação de seção
      ContratoService.listDocumentos(contrato.token)
        .then(respList => {
          setArquivoList(respList)
        })
        .catch(err => {
          toast.error(trataErro(err))
        })
        .finally(() => {})
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshArquivoList])

  return (
    <>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <CardHeader
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
      </Grid>
      <Dialog
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
