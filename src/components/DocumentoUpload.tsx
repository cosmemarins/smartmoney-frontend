// React Imports
import { useState } from 'react'

// MUI Imports
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import { toast } from 'react-toastify'
import { Card, CardActions, CardContent, CardMedia } from '@mui/material'

// Third-party Imports
// @ts-ignore
import { useDropzone } from 'react-dropzone'

import type { ArquivoUploadType } from '@/types/utilTypes'

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
  const [files, setFiles] = useState<File[]>([])

  // Hooks
  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    maxSize: 1000000,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
      'application/pdf': ['.pdf']
    },
    onDrop: (acceptedFiles: File[]) => {
      setFiles(acceptedFiles.map((file: File) => Object.assign(file)))
      setFileUpload(acceptedFiles.map((file: File) => Object.assign(file)))
    },
    onDropRejected: () => {
      toast.error('O arquivo só poder ter até 1 MB.', {
        autoClose: 3000
      })
    }
  })

  const img = files.map((file: FileProp) => (
    <CardMedia key={file.name} sx={{ minHeight: 170 }} image={URL.createObjectURL(file as any)} title={file.name} />
  ))

  return (
    <Card>
      <CardContent>
        <small>{arquivoUploadData.titulo}</small>
        <div {...getRootProps({ className: 'dropzone' })} className='border rounded border-dashed border-light p-2'>
          <input {...getInputProps()} />
          {files.length ? (
            img
          ) : arquivoUploadData.base64Data ? (
            <CardMedia
              key={arquivoUploadData.token}
              sx={{ minHeight: 170 }}
              image={`data:image/jpeg;base64, ${arquivoUploadData.base64Data}`}
              title={arquivoUploadData.titulo}
            />
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
              <Typography variant='body2'>Tamanho máximo do arquivo de 1 MB</Typography>
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
        {(files.length > 0 || arquivoUploadData.base64Data) && (
          <small className='w-full '>
            arquivos permitidos *.jpeg, *.jpg, *.png e *.pdf
            <br />
            tamanho máximo do arquivo de 1 MB
          </small>
        )}
      </CardActions>
    </Card>
  )
}

export default DocumentoUpload
