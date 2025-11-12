// MUI Imports
import Grid from '@mui/material/Grid'

// Component Imports
import ExtratoComissaoGestor from '@/views/financeiro/comissao/gestor/extrato'

const ExtratoComissaoApp = async ({ params }: { params: { token: string; ano: string; mes: string } }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12} lg={12} md={12}>
        <ExtratoComissaoGestor token={params.token} ano={params.ano} mes={params.mes} />
      </Grid>
    </Grid>
  )
}

export default ExtratoComissaoApp
