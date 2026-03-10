import Grid from '@mui/material/Grid'

import ExtratoList from '@views/extrato/list'
import { ExtratoProvider } from '@/contexts/ExtratoContext'

const ExtratoApp = async () => {
  return (
    <ExtratoProvider>
      <Grid container spacing={6}>
        <Grid item xs={12} lg={12} md={12}>
          <ExtratoList />
        </Grid>
      </Grid>
    </ExtratoProvider>
  )
}

export default ExtratoApp
