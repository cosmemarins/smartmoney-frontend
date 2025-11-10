// React Imports
import { Grid } from '@mui/material'

import ComissaoAtgParceirosListTable from './ComissaoAtgParceirosListTable'

interface Props {
  token: string | undefined
}

const ComissaoAtgParceirosList = ({ token }: Props) => {
  // States
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <ComissaoAtgParceirosListTable token={token} />
      </Grid>
    </Grid>
  )
}

export default ComissaoAtgParceirosList
