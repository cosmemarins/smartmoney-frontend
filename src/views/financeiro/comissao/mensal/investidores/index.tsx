// React Imports
import { Grid } from '@mui/material'

import ComissaoInvestidoresListTable from './ComissaoInvestidoresListTable'

interface Props {
  token: string | undefined
  ano?: string | undefined
  mes?: string | undefined
}

const ComissaoInvestidoresList = ({ token, ano, mes }: Props) => {
  // States
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <ComissaoInvestidoresListTable token={token} ano={ano} mes={mes} />
      </Grid>
    </Grid>
  )
}

export default ComissaoInvestidoresList
