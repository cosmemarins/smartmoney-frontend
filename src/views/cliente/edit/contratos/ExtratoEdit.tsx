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
import type { ExtratoType } from '@/types/ExtratoType'
import type { ArquivoUploadType, erroType } from '@/types/utilTypes'
import ContratoService from '@/services/ContratoService'
import { TipoExtratoEnumList } from '@/utils/enums/TipoExtratoEnum'
import ComprovanteUpload from '@/components/DocumentoUpload'

locale('pt-br')

interface props {
  extratoData: ExtratoType
  handleClose?: any
}

const ExtratoEdit = ({ extratoData, handleClose }: props) => {
  console.log('renderizando estratoEdit', extratoData)

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
    console.log('salvar sem documento', extratoEdit)
    ContratoService.salvarExtrato(extratoEdit)
      .then(respExtrato => {
        console.log(respExtrato)
        toast.success('Lançamento salvo com sucesso!')
        setExtratoEdit(respExtrato)
        handleClose(true)
      })
      .catch(err => {
        console.log('ERRO RESP', err)
        const erro = err?.response.data

        const msgErro =
          err?.response.status === 401
            ? 'Não autorizado, é preciso logar novamente'
            : Array.isArray(erro.message)
              ? erro.message.join(', ')
              : erro.message

        setErro({ msg: msgErro })
        toast.error(`Erro, ${msgErro}`)
      })
      .finally(() => {
        setReload(false)
      })
  }

  const salvarComDocumento = () => {
    const formData = new FormData()

    //os parametros devem ser appendados antes do file, senão não recupera lá no request do server
    formData.append('tipoDocumento', 'COMPROVANTE_FINANCEIRO')
    formData.append('token', `${extratoEdit.token}`) //esse aqui vai ser o inicio do nome do arquivo
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
        console.log(respExtrato)
        toast.success('Lançamento salvo com sucesso!')
        setExtratoEdit(respExtrato)
        handleClose(true)
      })
      .catch(err => {
        console.log('ERRO RESP', err)
        const erro = err?.response.data

        const msgErro =
          err?.response.status === 401
            ? 'Não autorizado, é preciso logar novamente'
            : Array.isArray(erro.message)
              ? erro.message.join(', ')
              : erro.message

        setErro({ msg: msgErro })
        toast.error(`Erro, ${msgErro}`)
      })
      .finally(() => {
        setReload(false)
      })
  }

  const handleSubmit = () => {
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
      nomeArquivo: extratoEdit.compDeposito,
      tipoUpload: 'COMPROVANTE'
    })
  }, [extratoEdit])

  useEffect(() => {
    if (extratoData?.token && extratoData.compDeposito) {
      //precisa recuperar por aqui pois tem que ser via axios por causa da validação de seção
      ContratoService.getThumbnail(extratoData.token)
        .then(dataImg => {
          setArquivoUploadData({
            ...arquivoUploadData,
            titulo: 'Comprovante',
            base64Data: dataImg
          })
          console.log(arquivoUploadData)
        })
        .catch(err => {
          console.log('Erro ao recuperar imagem:', err)
        })
    }
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
                      value={extratoEdit?.tipo ? extratoEdit?.tipo : ''}
                      onChange={e => setExtratoEdit({ ...extratoEdit, tipo: e.target.value })}
                    >
                      {TipoExtratoEnumList.map((tipo, index) => (
                        <MenuItem key={index} value={tipo.value} selected={extratoEdit?.tipo === tipo.value}>
                          {tipo.label}
                        </MenuItem>
                      ))}
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