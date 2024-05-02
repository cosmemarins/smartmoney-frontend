// MUI Imports
import Grid from '@mui/material/Grid'

// Component Imports
import DadosPrincipais from './DadosPrincipais'
import type { IdentificacaoType } from '@/types/ClienteType'

const OverViewTab = async ({ clienteData }: { clienteData?: IdentificacaoType }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <DadosPrincipais clienteData={clienteData} />
      </Grid>
    </Grid>
  )
}

export default OverViewTab
