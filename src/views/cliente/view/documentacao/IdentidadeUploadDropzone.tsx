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
import type { ClienteDocumentacaoType } from '@/types/ClienteType'
import type { erroType } from '@/types/utilTypes'

interface props {
  titulo: string
  tipoUpload: string
  documentacaoData: ClienteDocumentacaoType
}

type FileProp = {
  name: string
  type: string
  size: number
}

const IdentidadeUploadDropzone = ({ titulo, tipoUpload, documentacaoData }: props) => {
  // States
  const [erro, setErro] = useState<erroType>()
  const [reload, setReload] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [uploadStatus, setUploadStatus] = useState('')

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
    },
    onDropRejected: () => {
      toast.error('O arquivo só poder ter até 2 MB.', {
        autoClose: 3000
      })
    }
  })

  const img = files.map((file: FileProp) => (
    <CardMedia key={file.name} sx={{ height: 140 }} image={URL.createObjectURL(file as any)} title={file.name} />
  ))

  const handleUpload = () => {
    if (!documentacaoData?.token && documentacaoData?.token === '') toast.error(`Erro, cliente token não definido`)

    setReload(true)
    setErro(undefined)
    setUploadStatus('Uploading....')

    const formData = new FormData()

    //os parametros devem ser appendados antes do file, senão não recupera lá no request do server
    formData.append('tipoDocumento', tipoUpload)
    formData.append('token', `${documentacaoData.token}`)
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
      <CardHeader title={titulo} />
      <CardContent>
        {erro && (
          <Alert icon={false} severity='error' onClose={() => {}}>
            <AlertTitle>Erro</AlertTitle>
            {erro?.msg}
          </Alert>
        )}

        <div {...getRootProps({ className: 'dropzone' })}>
          <input {...getInputProps()} />
          {files.length ? (
            img
          ) : (
            <div className='flex items-center flex-col'>
              <Avatar variant='rounded' className='bs-12 is-12 mbe-9'>
                <i className='tabler-upload' />
              </Avatar>
              <Typography variant='h6' className='mbe-2.5'>
                Arraste e solte o arquivo aqui ou click para upload
              </Typography>
              <Typography>arqruivos permitidos *.jpeg, *.jpg, *.png, *.pdf</Typography>
              <Typography>Tamanho máximo do arquivo de 2 MB</Typography>
            </div>
          )}
        </div>
      </CardContent>
      <CardActions className='card-actions-dense'>
        {files.length > 0 && (
          <Button
            type='button'
            variant='tonal'
            color='secondary'
            onClick={() => {
              handleUpload()
            }}
          >
            {uploadStatus}
          </Button>
        )}
      </CardActions>
      <Backdrop open={reload} className='absolute text-white z-[cal(var(--mui-zIndex-mobileStepper)-1)]'>
        <CircularProgress color='inherit' />
      </Backdrop>
    </Card>
  )
}

export default IdentidadeUploadDropzone
