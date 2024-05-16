'use client'

// MUI Imports
import Grid from '@mui/material/Grid'

// Component Imports
import { Card, CardContent, CardHeader } from '@mui/material'

import IdentidadeUploadDropzone from './IdentidadeUploadDropzone'
import type { ClienteDocumentacaoType } from '@/types/ClienteType'

interface props {
  documentacaoData: ClienteDocumentacaoType
}

const DocumentacaoTab = ({ documentacaoData }: props) => {
  return (
    <Card>
      <CardHeader title='Documentação' />
      <CardContent className='flex flex-col gap-4'>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <IdentidadeUploadDropzone titulo='Identidade' tipoUpload='IDENTIDADE' documentacaoData={documentacaoData} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <IdentidadeUploadDropzone
              titulo='Comprovante de Residência'
              tipoUpload='COMPROVANTE_RESIDENCIA'
              documentacaoData={documentacaoData}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <IdentidadeUploadDropzone
              titulo='Comprovante de Conta Bancária'
              tipoUpload='COMPROVANTE_FINANCEIRO'
              documentacaoData={documentacaoData}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default DocumentacaoTab
