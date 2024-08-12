// MUI Imports
import { useEffect, useState } from 'react'

import Grid from '@mui/material/Grid'

// Component Imports
import { Button, Card, CardContent, CardHeader, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'

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
import type { ResumoContratoType } from '@/types/ResumoContratoType'
import { ResumoContratoInit } from '@/types/ResumoContratoType'

type Props = {
  contrato: ContratoType
  cliente?: ClienteType
  handleClose?: any
}

const Documentacao = ({ contrato, cliente, handleClose }: Props) => {
  //contexto
  const [openDlgArquivo, setOpenDlgArquivo] = useState<boolean>(false)
  const [tituloDlgArquivo, setTituloDlgArquivo] = useState('Novo Upload de Arquivo')
  const [openDlgAtivarContrato, setOpenDlgAtivarContrato] = useState<boolean>(false)
  const [arquivoList, setArquivoList] = useState<ArquivoType[]>([])
  const [refreshArquivoList, setRefreshArquivoList] = useState<boolean>(false)
  const [resumoContrato, setResumoContrato] = useState<ResumoContratoType>(ResumoContratoInit)

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

  //console.log('Documentacao 1 extratoInit', extratoInit)
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

  const handleAtivarContrato = () => {
    if (contrato?.token) {
      if (!resumoContrato.isAtivo) {
        ContratoService.ativarContrato(contrato?.token)
          .then(() => {
            //console.log(respContrato)
            toast.success(`Contrato ${contrato?.token} ativado!`)
            handleClose(true)
          })
          .catch(err => {
            console.log('ERRO contratoAtivar', err)
            toast.error(trataErro(err))
          })
          .finally(() => {})
      } else {
        toast.success(`Contrato ${contrato?.token} já está ativado!`)
      }
    }
  }

  const handleAtivarEEnviarContrato = () => {
    if (contrato?.token) {
      if (!resumoContrato.isAtivo) {
        ContratoService.ativarEEnviarContrato(contrato?.token)
          .then(() => {
            //console.log(respContrato)
            toast.success(`Contrato ${contrato?.token} ativado!`)
            handleClose(true)
          })
          .catch(err => {
            console.log('ERRO contratoAtivar', err)
            toast.error(trataErro(err))
          })
          .finally(() => {})
      } else {
        toast.success(`Contrato ${contrato?.token} já está ativado!`)
      }
    }
  }

  const carregaLista = () => {
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

      if (!openDlgAtivarContrato) {
        //atualiza o objeto resumo do contrato
        ContratoService.getResumo(contrato.token)
          .then(respResumo => {
            console.log('respResumo', respResumo)
            setResumoContrato(respResumo)
            if (respResumo.podeAtivar) setOpenDlgAtivarContrato(true)
          })
          .catch(err => {
            toast.error(trataErro(err))
          })
          .finally(() => {})
      }
    }
  }

  useEffect(() => {
    //console.log('Documentacao useeffect[]')
    carregaLista()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    //console.log('Documentacao useeffect refreshList')
    setRefreshArquivoList(false)
    carregaLista()
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
      <Dialog
        maxWidth='sm'
        open={openDlgAtivarContrato}
        aria-labelledby='form-dialog-title'
        disableEscapeKeyDown
        onClose={(event, reason) => {
          if (reason !== 'backdropClick') {
            handleCloseDlgArquivo()
          }
        }}
      >
        <DialogTitle id='form-dialog-title'>Ativar contrato</DialogTitle>
        <DialogContent>Este contrato já pode ser ativado, deseja ativa-lo agora?</DialogContent>
        <DialogActions className='dialog-actions-dense'>
          <Button
            variant='contained'
            color='info'
            onClick={() => {
              handleAtivarEEnviarContrato()
            }}
          >
            Ativar e Enviar contrato
          </Button>
          <Button
            variant='contained'
            color='success'
            onClick={() => {
              handleAtivarContrato()
            }}
          >
            Apenas ativar o contrato
          </Button>
          <Button
            type='reset'
            variant='contained'
            color='primary'
            onClick={() => {
              setOpenDlgAtivarContrato(false)
            }}
          >
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default Documentacao
