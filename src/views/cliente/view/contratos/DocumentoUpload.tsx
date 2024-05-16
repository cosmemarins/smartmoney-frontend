// React Imports
import { useState } from 'react'

// MUI Imports
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'

// Third-party Imports
// @ts-ignore
import { useDropzone } from 'react-dropzone'
import { toast } from 'react-toastify'
import {
  Alert,
  AlertTitle,
  Backdrop,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  CircularProgress
} from '@mui/material'

import { uploadDocumento } from '@/services/ClienteService'
import type { ArquivoUploadType, erroType } from '@/types/utilTypes'

interface props {
  arquivoUploadData: ArquivoUploadType
  setFileUpload: any
}

type FileProp = {
  name: string
  type: string
  size: number
}

const DocumentoUpload = ({ arquivoUploadData, setFileUpload }: props) => {
  // States
  const [erro, setErro] = useState<erroType>()
  const [reload, setReload] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [uploadStatus, setUploadStatus] = useState('Enviar')

  // Hooks
  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    maxSize: 2000000,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
      'application/pdf': ['.pdf']
    },
    onDrop: (acceptedFiles: File[]) => {
      setFiles(acceptedFiles.map((file: File) => Object.assign(file)))
      setFileUpload(acceptedFiles.map((file: File) => Object.assign(file)))
    },
    onDropRejected: () => {
      toast.error('O arquivo só poder ter até 2 MB.', {
        autoClose: 3000
      })
    }
  })

  const img = files.map((file: FileProp) => (
    <CardMedia key={file.name} sx={{ minHeight: 170 }} image={URL.createObjectURL(file as any)} title={file.name} />
  ))

  const handleUpload = () => {
    if (!arquivoUploadData?.token && arquivoUploadData?.token === '') toast.error(`Erro, cliente token não definido`)

    setReload(true)
    setErro(undefined)
    setUploadStatus('Uploading....')

    const formData = new FormData()

    //os parametros devem ser appendados antes do file, senão não recupera lá no request do server
    formData.append('tipoDocumento', arquivoUploadData.tipoUpload)
    formData.append('token', `${arquivoUploadData.token}`)
    files.forEach(image => {
      formData.append('file', image)
    })

    uploadDocumento(formData)
      .then(() => {
        //console.log(respCliente)
        toast.success('Documento salvo com sucesso!')
        setUploadStatus('Upload')
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
        setUploadStatus('Upload')
      })
  }

  return (
    <Card>
      <CardContent>
        <small>{arquivoUploadData.titulo}</small>
        <div {...getRootProps({ className: 'dropzone' })} className='border rounded border-dashed border-light p-2'>
          <input {...getInputProps()} />
          {files.length ? (
            img
          ) : (
            <div style={{ minHeight: '203px' }} className='flex items-center flex-col'>
              <Avatar variant='rounded' className='bs-12 is-12 mbe-5'>
                <i className='tabler-upload' />
              </Avatar>
              <Typography variant='h6' className='mbe-2 text-center'>
                Arraste e solte o arquivo aqui ou
                <br /> click para upload
              </Typography>
              <Typography variant='body2'>arquivos permitidos *.jpeg, *.jpg, *.png, *.pdf</Typography>
              <Typography variant='body2'>Tamanho máximo do arquivo de 2 MB</Typography>
            </div>
          )}
        </div>
      </CardContent>
      <CardActions
        disableSpacing
        sx={{
          alignSelf: 'stretch',
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'flex-start'
        }}
      >
        {files.length > 0 && (
          <small className='w-full '>
            arquivos permitidos *.jpeg, *.jpg, *.png e *.pdf
            <br />
            tamanho máximo do arquivo de 1 MB
          </small>
        )}
      </CardActions>
      <Backdrop open={reload} className='absolute text-white z-[cal(var(--mui-zIndex-mobileStepper)-1)]'>
        <CircularProgress color='inherit' />
      </Backdrop>
    </Card>
  )
}

export default DocumentoUpload
