// React Imports
import { Grid } from '@mui/material'

import ComissaoParceirosListTable from './ComissaoParceirosListTable'

interface Props {
  token: string | undefined
  ano?: string | undefined
  mes?: string | undefined
}

const ComissaoParceirosList = ({ token, ano, mes }: Props) => {
  // States
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <ComissaoParceirosListTable token={token} ano={ano} mes={mes} />
      </Grid>
    </Grid>
  )
}

export default ComissaoParceirosList
