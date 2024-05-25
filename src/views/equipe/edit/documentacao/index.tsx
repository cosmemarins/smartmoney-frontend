// MUI Imports
import Grid from '@mui/material/Grid'

// Component Imports
import { Card, CardContent, CardHeader } from '@mui/material'

import { TipoDocumentoEnum } from '@/utils/enums/TipoDocumentoEnum'
import DocumentoUploadDropzone from './DocumentoUploadDropzone'

const DocumentacaoTab = () => {
  return (
    <Card>
      <CardHeader title='Documentação' />
      <CardContent className='flex flex-col gap-4'>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <DocumentoUploadDropzone titulo='Identidade' tipoUpload={TipoDocumentoEnum.IDENTIDADE} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <DocumentoUploadDropzone
              titulo='Comprovante de Residência'
              tipoUpload={TipoDocumentoEnum.COMPROVANTE_RESIDENCIA}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <DocumentoUploadDropzone
              titulo='Comprovante de Conta Bancária'
              tipoUpload={TipoDocumentoEnum.COMPROVANTE_FINANCEIRO}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default DocumentacaoTab
