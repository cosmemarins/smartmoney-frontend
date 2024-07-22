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

import axios from 'axios'

import CustomTextField from '@core/components/mui/TextField'
import type { ExtratoType } from '@/types/ExtratoType'
import type { ArquivoUploadType, erroType } from '@/types/utilTypes'
import ContratoService from '@/services/ContratoService'
import type { TipoExtratoEnum } from '@/utils/enums/TipoExtratoEnum'
import { getTipoExtratoEnumDesc, TipoExtratoEnumList } from '@/utils/enums/TipoExtratoEnum'
import ComprovanteUpload from '@/components/DocumentoUpload'
import type { ValidationError } from '@/services/api'
import { TipoArquivoRegistroEnum } from '@/utils/enums/TipoArquivoRegistroEnum'

locale('pt-br')

interface props {
  extratoData: ExtratoType
  handleClose?: any
  tipoExtrato?: TipoExtratoEnum
}

const ExtratoEdit = ({ extratoData, handleClose, tipoExtrato }: props) => {
  // States
  const [erro, setErro] = useState<erroType>()
  const [reload, setReload] = useState(false)
  const [arquivoUploadData, setArquivoUploadData] = useState<ArquivoUploadType>({ token: extratoData?.token })
  const [files, setFiles] = useState<File[]>([])

  const [extratoEdit, setExtratoEdit] = useState<ExtratoType>(extratoData)

  const onChangeValor = (value: string) => {
    const valorStr = value.replace(/[^\d]+/g, '')
    const valor = parseFloat(valorStr) / 100

    setExtratoEdit({ ...extratoEdit, valor })
  }

  const salvarSemDocumento = () => {
    //console.log('salvar sem documento', extratoEdit)

    ContratoService.salvarExtrato(extratoEdit)
      .then(respExtrato => {
        //console.log(respExtrato)
        toast.success('Lançamento salvo com sucesso!')
        setExtratoEdit(respExtrato)
        handleClose(true)
      })
      .catch(err => {
        let msgErro = 'Ocorreu um erro ao tentar salvar o registro'

        if (axios.isAxiosError<ValidationError, Record<string, unknown>>(err)) {
          console.log('status', err.status)
          console.error('response', err.response)
          msgErro = err?.response?.request.responseText
        } else {
          console.error(err)
          msgErro = err
        }

        setErro({ msg: msgErro })
      })
      .finally(() => {
        setReload(false)
      })
  }

  const salvarComDocumento = () => {
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
        const msgErro = 'Ocorreu um erro ao tentar salvar o registro'

        if (axios.isAxiosError<ValidationError, Record<string, unknown>>(err)) {
          console.log(err.status)
          console.error(err.response)
          toast.error(`Erro, ${err.status}`)
        } else {
          console.error(err)
          toast.error(`Erro`, err)
        }

        setErro({ msg: msgErro })
      })
      .finally(() => {
        setReload(false)
      })
  }

  const handleSubmit = () => {
    if (!extratoEdit.valor || extratoEdit.valor <= 0) {
      toast.error('É preciso informar um valor')

      return
    }

    if (!extratoEdit.tipo) {
      toast.error('É preciso informar um tipo para esta operação')

      return
    }

    setReload(true)
    setErro(undefined)

    if (files.length > 0) {
      salvarComDocumento()
    } else {
      salvarSemDocumento()
    }
  }

  useEffect(() => {
    setArquivoUploadData({
      ...arquivoUploadData,
      token: extratoEdit.token,
      titulo: 'Comprovante',
      nomeArquivo: extratoEdit.arquivo?.nome,
      tipoUpload: 'COMPROVANTE'
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [extratoEdit])

  useEffect(() => {
    if (extratoData?.token && extratoData.arquivo) {
      //precisa recuperar por aqui pois tem que ser via axios por causa da validação de seção
      ContratoService.getThumbnail(extratoData.token)
        .then(dataImg => {
          setArquivoUploadData({
            ...arquivoUploadData,
            titulo: 'Comprovante',
            base64Data: dataImg
          })

          //console.log(arquivoUploadData)
        })
        .catch(err => {
          console.log('Erro ao recuperar imagem:', err)
        })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
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
                      value={extratoEdit?.data ? moment(extratoEdit?.data).format('YYYY-MM-DD HH:mm') : ''}
                      onChange={e => setExtratoEdit({ ...extratoEdit, data: new Date(e.target.value) })}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <CustomTextField
                      select
                      fullWidth
                      label='Tipo'
                      disabled={tipoExtrato ? true : false}
                      value={extratoEdit?.tipo ? extratoEdit?.tipo : ''}
                      onChange={e => setExtratoEdit({ ...extratoEdit, tipo: e.target.value })}
                    >
                      {tipoExtrato ? (
                        <MenuItem value={tipoExtrato} selected={true}>
                          {getTipoExtratoEnumDesc(tipoExtrato)}
                        </MenuItem>
                      ) : (
                        TipoExtratoEnumList.map((tipo, index) => (
                          <MenuItem key={index} value={tipo.value} selected={extratoEdit?.tipo === tipo.value}>
                            {tipo.label}
                          </MenuItem>
                        ))
                      )}
                    </CustomTextField>
                  </Grid>
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
                  <Grid item xs={12} sm={12}>
                    <CustomTextField
                      fullWidth
                      label='Histórico'
                      value={extratoEdit?.historico}
                      onChange={e => setExtratoEdit({ ...extratoEdit, historico: e.target.value })}
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
  )
}

export default ExtratoEdit
