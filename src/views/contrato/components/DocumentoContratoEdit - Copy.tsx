// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import { Backdrop, Button, Card, CardContent, CircularProgress, Divider, MenuItem } from '@mui/material'
import moment, { locale } from 'moment'
import 'moment/locale/pt-br'

import { toast } from 'react-toastify'

import CustomTextField from '@core/components/mui/TextField'
import type { ArquivoType } from '@/types/ArquivoType'
import type { ArquivoUploadType, DialogConfirmaType, erroType } from '@/types/utilTypes'
import ArquivoService from '@/services/ArquivoService'
import {
  TipoDocumentoEnum,
  TipoDocumentoExtratoEnumList,
  TipoDocumentoPessoaJuridicaEnumList,
  TipoDocumentoPessoFisicaEnumList
} from '@/utils/enums/TipoDocumentoEnum'
import ComprovanteUpload from '@/components/DocumentoUpload'
import { trataErro } from '@/utils/erro'
import DialogConfirma from '@/components/DialogConfirma'
import { useClienteContext } from '@/contexts/ClienteContext'
import { TipoArquivoRegistroEnum } from '@/utils/enums/TipoArquivoRegistroEnum'
import type { ExtratoType } from '@/types/ExtratoType'
import ContratoService from '@/services/ContratoService'

locale('pt-br')

interface props {
  arquivoData: ArquivoType
  extratoData?: ExtratoType
  handleClose?: any
  setRefresh?: any
  disableSelectTipo?: boolean
}

const DocumentoContratoEdit = ({ arquivoData, extratoData, handleClose, setRefresh, disableSelectTipo }: props) => {
  // States
  const [erro, setErro] = useState<erroType>()
  const [reload, setReload] = useState(false)
  const [arquivoUploadData, setArquivoUploadData] = useState<ArquivoUploadType>({ token: arquivoData?.token })
  const [files, setFiles] = useState<File[]>([])

  const [arquivoEdit, setArquivoEdit] = useState<ArquivoType>(arquivoData)
  const [extratoEdit, setExtratoEdit] = useState<ExtratoType>()
  const [dialogConfirma, setDialogConfirma] = useState<DialogConfirmaType>({ open: false })

  const { setLoadingContext } = useClienteContext()

  const handleOpenDlgConfirmaExcluir = () => {
    setDialogConfirma({
      open: true,
      titulo: 'Excluir Arquivo',
      texto: `Tem certeza que deseja excluir o arquivo ${arquivoEdit.token}?`,
      botaoConfirma: 'Confirmar Exclusão',
      handleConfirma: handleExcluirArquivo
    })
  }

  const handleExcluirArquivo = () => {
    setLoadingContext(true)
    setErro(undefined)

    if (arquivoEdit.token) {
      ArquivoService.excluir(arquivoEdit?.token)
        .then(() => {
          //console.log('respContrato', respContrato)
          setRefresh(true)
          toast.success(`Arquivo ${arquivoEdit?.token} excluído!`)
          setArquivoEdit({})
          handleClose(true)
        })
        .catch(err => {
          setErro({ msg: trataErro(err) })
        })
        .finally(() => {
          setLoadingContext(false)
        })
    }
  }

  const salvarArquivo = () => {
    const formData = new FormData()

    //os parametros devem ser appendados antes do file, senão não recupera lá no request do server
    formData.append(
      'arquivo',
      JSON.stringify({
        ...arquivoEdit
      })
    )

    files.forEach(image => {
      formData.append('file', image)
    })

    ArquivoService.salvarArquivo(formData)
      .then(() => {
        //console.log(resp)
        setRefresh(true)
        toast.success('Arquivo salvo com sucesso!')

        //setArquivoEdit(respExtrato)
        handleClose(true)
      })
      .catch(err => {
        setErro({ msg: trataErro(err) })
      })
      .finally(() => {
        setReload(false)
      })
  }

  const salvarExtratoSemDocumento = () => {
    if (!extratoEdit) {
      toast.error('Dados do aporte não localizado')

      return
    }

    setExtratoEdit({
      ...extratoEdit,
      historico: arquivoEdit.descricao
    })

    ContratoService.salvarExtrato(extratoEdit)
      .then(respExtrato => {
        //console.log(respExtrato)
        toast.success('Lançamento salvo com sucesso!')
        setExtratoEdit(respExtrato)
        handleClose(true)
      })
      .catch(err => {
        setErro({ msg: trataErro(err) })
      })
      .finally(() => {
        setReload(false)
      })
  }

  const salvarExtratoComDocumento = () => {
    console.log('extratoEdit', extratoEdit)
    setReload(false)

    return

    if (!extratoEdit) {
      toast.error('Dados do aporte não localizado')

      return
    }

    const formData = new FormData()

    //os parametros devem ser appendados antes do file, senão não recupera lá no request do server
    //o arquivo tem que mandar separado
    formData.append(
      'arquivo',
      JSON.stringify({
        ...extratoEdit.arquivo,
        tipoDocumento: extratoEdit.tipo,
        tipoRegistro: TipoArquivoRegistroEnum.EXTRATO
      })
    )

    formData.append(
      'extrato',
      JSON.stringify({
        ...extratoEdit,
        historico: arquivoEdit.descricao,
        contrato: {
          //so precisa enviar o token do contrato
          token: extratoEdit.contrato.token
        }
      })
    )

    files.forEach(image => {
      formData.append('file', image)
    })

    ContratoService.salvarExtratoComDocumento(formData)
      .then(respExtrato => {
        //console.log(respExtrato)
        toast.success('Lançamento salvo com sucesso!')
        setExtratoEdit(respExtrato)
        handleClose(true)
      })
      .catch(err => {
        setErro({ msg: trataErro(err) })
      })
      .finally(() => {
        setReload(false)
      })
  }

  const update = () => {
    ArquivoService.update(arquivoEdit)
      .then(() => {
        //console.log(resp)
        setRefresh(true)
        toast.success('Arquivo salvo com sucesso!')
        handleClose(true)
      })
      .catch(err => {
        setErro({ msg: trataErro(err) })
      })
      .finally(() => {
        setReload(false)
      })
  }

  const handleSubmit = () => {
    if (!arquivoEdit.idRegistro || arquivoEdit.idRegistro <= 0) {
      toast.error('É preciso informar um cliente ou usuário')

      return
    }

    if (arquivoEdit.tipoDocumento === TipoDocumentoEnum.APORTE) {
      if (!extratoEdit || !extratoEdit.valor || extratoEdit.valor <= 0) {
        toast.error('É preciso informar um valor para o aporte')

        return
      }
    }

    if (!arquivoEdit?.token && files.length <= 0) {
      toast.error('É preciso selecionar um arquivo')

      return
    }

    setReload(true)
    setErro(undefined)

    if (files.length > 0) {
      if (arquivoEdit.tipoDocumento === TipoDocumentoEnum.APORTE) {
        if (files.length > 0) salvarExtratoComDocumento()
        else salvarExtratoSemDocumento()
      } else {
        salvarArquivo()
      }
    } else {
      update()
    }
  }

  const onChangeValor = (value: string) => {
    const valorStr = value.replace(/[^\d]+/g, '')
    const valor = parseFloat(valorStr) / 100

    if (extratoEdit) setExtratoEdit({ ...extratoEdit, valor })
  }

  useEffect(() => {
    console.log('useEffect[], arquivoData', arquivoData)
    console.log('useEffect[], extratoEdit', extratoEdit)
    console.log('useEffect[], extratoData', extratoData)

    if (extratoData) {
      setExtratoEdit(extratoData)
    }

    if (arquivoData?.token) {
      //precisa recuperar por aqui pois tem que ser via axios por causa da validação de seção
      //precisa recuperar por aqui pois tem que ser via axios por causa da validação de seção
      ArquivoService.getThumbnail(arquivoData.token)
        .then(dataImg => {
          setArquivoUploadData({
            ...arquivoUploadData,
            titulo: 'Documento',
            base64Data: dataImg
          })
        })
        .catch(err => {
          console.log('Erro ao recuperar imagem:', err)
          setErro({ msg: trataErro(err) })
        })
        .finally(() => {
          //setLoadFile(false)
        })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <form onSubmit={e => e.preventDefault()}>
        {' '}
        {erro && (
          <Alert icon={false} severity='error' onClose={() => {}} className='mb-3'>
            <AlertTitle>Erro</AlertTitle>
            {erro?.msg}
          </Alert>
        )}
        <Grid container spacing={4}>
          <Grid item xs={12} md={7}>
            <Card>
              <CardContent className='flex flex-col gap-4'>
                <Grid container spacing={2}>
                  <Grid container spacing={4}>
                    <Grid item xs={12} sm={12}>
                      <CustomTextField
                        type='datetime-local'
                        fullWidth
                        label='Data'
                        value={arquivoEdit?.data ? moment(arquivoEdit?.data).format('YYYY-MM-DD HH:mm') : ''}
                        onChange={e => setArquivoEdit({ ...arquivoEdit, data: new Date(e.target.value) })}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12}>
                      <CustomTextField
                        select
                        fullWidth
                        label='Tipo'
                        disabled={disableSelectTipo}
                        value={arquivoEdit?.tipoDocumento ? arquivoEdit?.tipoDocumento : ''}
                        onChange={e => setArquivoEdit({ ...arquivoEdit, tipoDocumento: e.target.value })}
                      >
                        {arquivoData.tipoRegistro === TipoArquivoRegistroEnum.CLIENTE &&
                          arquivoEdit.cliente?.tipoPessoa == 'F' &&
                          TipoDocumentoPessoFisicaEnumList.map((tipo, index) => (
                            <MenuItem
                              key={index}
                              value={tipo.value}
                              selected={arquivoEdit?.tipoDocumento === tipo.value}
                            >
                              {tipo.label}
                            </MenuItem>
                          ))}

                        {arquivoData.tipoRegistro === TipoArquivoRegistroEnum.CLIENTE &&
                          arquivoEdit.cliente?.tipoPessoa == 'J' &&
                          TipoDocumentoPessoaJuridicaEnumList.map((tipo, index) => (
                            <MenuItem
                              key={index}
                              value={tipo.value}
                              selected={arquivoEdit?.tipoDocumento === tipo.value}
                            >
                              {tipo.label}
                            </MenuItem>
                          ))}

                        {arquivoData.tipoRegistro === TipoArquivoRegistroEnum.EXTRATO &&
                          TipoDocumentoExtratoEnumList.map((tipo, index) => (
                            <MenuItem
                              key={index}
                              value={tipo.value}
                              selected={arquivoEdit?.tipoDocumento === tipo.value}
                            >
                              {tipo.label}
                            </MenuItem>
                          ))}
                      </CustomTextField>
                    </Grid>
                    {arquivoEdit.tipoDocumento === TipoDocumentoEnum.APORTE && (
                      <Grid item xs={12} sm={12}>
                        <CustomTextField
                          fullWidth
                          label='Valor'
                          value={
                            extratoEdit?.valor
                              ? extratoEdit?.valor.toLocaleString('pt-BR', {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2
                                })
                              : 0
                          }
                          onChange={e => onChangeValor(e.target.value)}
                        />
                      </Grid>
                    )}
                    <Grid item xs={12} sm={12}>
                      <CustomTextField
                        fullWidth
                        label='Histórico'
                        value={arquivoEdit?.descricao}
                        onChange={e => setArquivoEdit({ ...arquivoEdit, descricao: e.target.value })}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={5}>
            <ComprovanteUpload arquivoUploadData={arquivoUploadData} setFileUpload={setFiles} />
          </Grid>

          <Divider />
          <Grid item xs={12} sm={12} className='text-right'>
            {arquivoEdit.token && (
              <Button
                type='button'
                variant='contained'
                className='mie-2'
                sx={{ float: 'left' }}
                onClick={() => {
                  handleOpenDlgConfirmaExcluir()
                }}
              >
                Excluir
              </Button>
            )}
            <Button
              type='button'
              variant='contained'
              className='mie-2'
              onClick={() => {
                handleSubmit()
              }}
            >
              Salvar
            </Button>
            <Button
              type='reset'
              variant='tonal'
              color='secondary'
              onClick={() => {
                handleClose(false)
              }}
            >
              Cancelar
            </Button>
          </Grid>
          <Backdrop open={reload} className='absolute text-white z-[cal(var(--mui-zIndex-mobileStepper)-1)]'>
            <CircularProgress color='inherit' />
          </Backdrop>
        </Grid>
      </form>
      <DialogConfirma dialogConfirmaOptions={dialogConfirma} />
    </>
  )
}

export default DocumentoContratoEdit
