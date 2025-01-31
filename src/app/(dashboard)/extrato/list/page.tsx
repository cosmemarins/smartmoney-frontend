// MUI Imports
import Grid from '@mui/material/Grid'

// Component Imports
import ExtratoList from '@views/extrato/list'

const ExtratoApp = async () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12} lg={12} md={12}>
        <ExtratoList />
      </Grid>
    </Grid>
  )
}

export default ExtratoApp
