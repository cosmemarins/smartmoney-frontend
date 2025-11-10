// MUI Imports
import Grid from '@mui/material/Grid'

// Component Imports
import ExtratoComissaoContrato from '@views/contrato/extrato-comissao'

const ExtratoComissaoApp = async ({ params }: { params: { token: string } }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12} lg={12} md={12}>
        <ExtratoComissaoContrato token={params.token} />
      </Grid>
    </Grid>
  )
}

export default ExtratoComissaoApp
