// MUI Imports
import Grid from '@mui/material/Grid'

// Component Imports
import DadosBancarios from './DadosBancarios'

const DadosBancariosTab = async () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <DadosBancarios />
      </Grid>
    </Grid>
  )
}

export default DadosBancariosTab
