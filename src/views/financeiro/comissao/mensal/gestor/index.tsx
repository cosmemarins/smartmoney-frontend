// React Imports
import { Grid } from '@mui/material'

import ComissaoGestorListTable from './ComissaoGestorListTable'

interface Props {
  token: string | undefined
  ano?: string | undefined
  mes?: string | undefined
}

const ComissaoGestorList = ({ token, ano, mes }: Props) => {
  // States
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <ComissaoGestorListTable token={token} ano={ano} mes={mes} />
      </Grid>
    </Grid>
  )
}

export default ComissaoGestorList
