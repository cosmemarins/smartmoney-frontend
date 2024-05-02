// MUI Imports
import Grid from '@mui/material/Grid'

// Component Imports
import Documentacao from './Documentacao'

const DocumentacaoTab = async () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Documentacao />
      </Grid>
    </Grid>
  )
}

export default DocumentacaoTab
