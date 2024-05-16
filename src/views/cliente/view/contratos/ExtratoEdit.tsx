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
import ComprovanteUpload from './DocumentoUpload'

locale('pt-br')

interface props {
  extratoData: ExtratoType
  handleClose?: any
}

const ExtratoEdit = ({ extratoData, handleClose }: props) => {
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

  const handleSubmit = () => {
    const formData = new FormData()

    //os parametros devem ser appendados antes do file, senão não recupera lá no request do server
    formData.append('tipoDocumento', 'COMPROVANTE')
    formData.append('tokenContrato', `${extratoEdit.contrato.token}`)
    formData.append('extrato', JSON.stringify(extratoEdit))

    files.forEach(image => {
      formData.append('file', image)
    })

    setReload(true)
    setErro(undefined)
    ContratoService.salvarExtratoComDocumento(formData)
      .then(respExtrato => {
        console.log(respExtrato)
        toast.success('Contrato salvo com sucesso!')
        setExtratoEdit(respExtrato)
        handleClose()
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

  useEffect(() => {
    setArquivoUploadData({
      token: extratoEdit.token,
      titulo: 'Comprovante',
      nomeArquivo: extratoEdit.compDeposito,
      tipoUpload: 'COMPROVANTE'
    })
  }, [extratoEdit])

  return (
    <form onSubmit={e => e.preventDefault()}>
      {' '}
      {erro && (
        <Alert icon={false} severity='error' onClose={() => {}}>
          <AlertTitle>Erro</AlertTitle>
          {erro?.msg}
        </Alert>
      )}
      <Grid container spacing={4}>
        <Grid item xs={12} md={7}>
          <Card>
            <CardContent className='flex flex-col gap-4'>
              {erro && (
                <Alert icon={false} severity='error' onClose={() => {}}>
                  <AlertTitle>Erro</AlertTitle>
                  {erro?.msg}
                </Alert>
              )}
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
        <Grid item xs={12} sm={12}>
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
              handleClose()
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
