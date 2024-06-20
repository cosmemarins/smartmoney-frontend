// MUI Imports
import Grid from '@mui/material/Grid'

// Component Imports
import Extrato from '@views/contrato/extrato'

const ExtratoApp = async ({ params }: { params: { token: string } }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12} lg={12} md={12}>
        <Extrato token={params.token} />
      </Grid>
    </Grid>
  )
}

export default ExtratoApp
