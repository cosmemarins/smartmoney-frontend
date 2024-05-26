// MUI Imports
import Grid from '@mui/material/Grid'

// Component Imports
import AlterarSenha from './AlterarSenha'

const SegurancaTab = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <AlterarSenha />
      </Grid>
    </Grid>
  )
}

export default SegurancaTab
