// MUI Imports
import Grid from '@mui/material/Grid'

// Component Imports
import Contratos from './Contratos'

const ContratosTab = async () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Contratos />
      </Grid>
    </Grid>
  )
}

export default ContratosTab
