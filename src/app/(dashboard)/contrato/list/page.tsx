// MUI Imports
import Grid from '@mui/material/Grid'

// Component Imports
import ContratoList from '@views/contrato/list'

const ContratoApp = async () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12} lg={12} md={12}>
        <ContratoList />
      </Grid>
    </Grid>
  )
}

export default ContratoApp
