// React Imports
import { Grid } from '@mui/material'

import ComissaoAgentesListTable from './ComissaoAgentesListTable'

interface Props {
  token: string | undefined
  ano?: string | undefined
  mes?: string | undefined
}

const ComissaoAgentesList = ({ token, ano, mes }: Props) => {
  // States
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <ComissaoAgentesListTable token={token} ano={ano} mes={mes} />
      </Grid>
    </Grid>
  )
}

export default ComissaoAgentesList
