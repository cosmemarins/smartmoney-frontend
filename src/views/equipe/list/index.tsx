import { Grid } from '@mui/material'
import UsuarioListTable from './UsuarioListTable'
import { EquipeProvider } from '@/contexts/EquipeContext'

interface Props {
  perfil: string
}

const UsuarioList = ({ perfil }: Props) => {
  // States
  return (
    <EquipeProvider>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <UsuarioListTable perfil={perfil} />
        </Grid>
      </Grid>
    </EquipeProvider>
  )
}

export default UsuarioList