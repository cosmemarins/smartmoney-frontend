// React Imports
import { Grid } from '@mui/material'

import UsuarioListTable from './UsuarioListTable'

interface Props {
  perfil: string
}

const UsuarioList = ({ perfil }: Props) => {
  // States
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <UsuarioListTable perfil={perfil} />
      </Grid>
    </Grid>
  )
}

export default UsuarioList
