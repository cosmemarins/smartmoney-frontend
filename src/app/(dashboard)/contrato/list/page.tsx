import Grid from '@mui/material/Grid'

import ContratoList from '@views/contrato/list'
import { ContratoProvider } from '@/contexts/ContratoContext'

const ContratoApp = async () => {
  return (
    <ContratoProvider>
      <Grid container spacing={6}>
        <Grid item xs={12} lg={12} md={12}>
          <ContratoList />
        </Grid>
      </Grid>
    </ContratoProvider>
  )
}

export default ContratoApp
