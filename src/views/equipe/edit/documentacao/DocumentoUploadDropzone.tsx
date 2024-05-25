// React Imports
import { useEffect, useState } from 'react'

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
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  CircularProgress
} from '@mui/material'

import axios from 'axios'

import { getThumbnailUsuario, uploadDocumento } from '@/services/UsuarioService'
import type { erroType } from '@/types/utilTypes'
import type { ValidationError } from '@/services/api'
import { TipoDocumentoEnum } from '@/utils/enums/TipoDocumentoEnum'
import { useUsuarioContext } from '@/contexts/UsuarioContext'

interface props {
  titulo: string
  tipoUpload: TipoDocumentoEnum
}

type FileProp = {
  name: string
  type: string
  size: number
}

const DocumentoUploadDropzone = ({ titulo, tipoUpload }: props) => {
  // States
  const [erro, setErro] = useState<erroType>()
  const [loadFile, setLoadFile] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [uploadStatus, setUploadStatus] = useState('Salvar arquivo')
  const [fileDocumento, setFileDocumento] = useState<any>()

  const { usuario, setUsuarioContext } = useUsuarioContext()

  // Hooks
  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    maxSize: 1024 * 1024,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
      'application/pdf': ['.pdf']
    },
    onDrop: (acceptedFiles: File[]) => {
      setFiles(acceptedFiles.map((file: File) => Object.assign(file)))
    },
    onDropRejected: () => {
      toast.error('O arquivo só poder ter até 1 MB.', {
        autoClose: 3000
      })
    }
  })

  const img = files.map((file: FileProp) => (
    <CardMedia
      key={file.name}
      sx={{ height: 140, cursor: 'pointer' }}
      image={URL.createObjectURL(file as any)}
      title={file.name}
    />
  ))

  const handleUpload = () => {
    if (!usuario) {
      toast.error('Usuario não informado!')

      return
    }

    if (!usuario.token) {
      toast.error('Token do usuario não informado!')

      return
    }

    setLoadFile(true)
    setErro(undefined)
    setUploadStatus('Uploading....')

    const formData = new FormData()

    //os parametros devem ser appendados antes do file, senão não recupera lá no request do server
    formData.append('tipoDocumento', tipoUpload)
    formData.append('token', `${usuario.token}`)
    files.forEach(image => {
      formData.append('file', image)
    })

    uploadDocumento(formData)
      .then(respUpload => {
        console.log('respUpload', respUpload)

        switch (tipoUpload) {
          case TipoDocumentoEnum.IDENTIDADE:
            setUsuarioContext({
              ...usuario,
              docIdentidade: respUpload.docIdentidade
            })
            break
          case TipoDocumentoEnum.COMPROVANTE_RESIDENCIA:
            setUsuarioContext({
              ...usuario,
              compResidencia: respUpload.compResidencia
            })
            break
          case TipoDocumentoEnum.COMPROVANTE_FINANCEIRO:
            setUsuarioContext({
              ...usuario,
              compFinanceiro: respUpload.compFinanceiro
            })
            break
        }

        toast.success('Documento salvo com sucesso!')
      })
      .catch(err => {
        if (axios.isAxiosError<ValidationError, Record<string, unknown>>(err)) {
          console.log(err.status)
          console.error(err.response)
          toast.error(`Erro, ${err.status}`)
        } else {
          console.error(err)
          toast.error(`Erro`, err)
        }
      })
      .finally(() => {
        setLoadFile(false)
        setUploadStatus('Salvar arquivo')
      })
  }

  useEffect(() => {
    if (usuario && usuario.token) {
      if (
        (usuario.docIdentidade && tipoUpload === TipoDocumentoEnum.IDENTIDADE) ||
        (usuario.compResidencia && tipoUpload === TipoDocumentoEnum.COMPROVANTE_RESIDENCIA) ||
        (usuario.compFinanceiro && tipoUpload === TipoDocumentoEnum.COMPROVANTE_FINANCEIRO)
      ) {
        setLoadFile(true)

        //precisa recuperar por aqui pois tem que ser via axios por causa da validação de seção
        getThumbnailUsuario(usuario.token, tipoUpload)
          .then(dataImg => {
            setFileDocumento(dataImg)
          })
          .catch(err => {
            console.log('Erro ao recuperar imagem:', err)
          })
          .finally(() => {
            setLoadFile(false)
          })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
          ) : fileDocumento && !loadFile ? (
            <CardMedia
              key={usuario?.token}
              sx={{ minHeight: 250 }}
              image={`data:image/jpeg;base64, ${fileDocumento}`}
              title={titulo}
            />
          ) : loadFile ? (
            <div className='flex items-center flex-col' style={{ cursor: 'pointer' }}>
              <CircularProgress />
            </div>
          ) : (
            <div className='flex items-center flex-col' style={{ cursor: 'pointer' }}>
              <Avatar variant='rounded' className='bs-12 is-12 mbe-9'>
                <i className='tabler-upload' />
              </Avatar>
              <Typography variant='h6' className='mbe-2.5'>
                Arraste e solte o arquivo aqui ou click para upload
              </Typography>
              <Typography>arqruivos permitidos *.jpeg, *.jpg, *.png, *.pdf</Typography>
              <Typography>Tamanho máximo do arquivo de 1 MB</Typography>
            </div>
          )}
        </div>
      </CardContent>
      <CardActions className='card-actions-dense'>
        {(files.length > 0 || fileDocumento) && (
          <small className='w-full '>
            arquivos permitidos *.jpeg, *.jpg, *.png e *.pdf
            <br />
            tamanho máximo do arquivo de 1 MB
          </small>
        )}
        {files.length > 0 && (
          <Button
            type='button'
            variant='contained'
            onClick={() => {
              handleUpload()
            }}
          >
            {uploadStatus}
          </Button>
        )}
      </CardActions>
    </Card>
  )
}

export default DocumentoUploadDropzone
