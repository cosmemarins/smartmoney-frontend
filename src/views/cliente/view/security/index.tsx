// MUI Imports
import Grid from '@mui/material/Grid'

// Component Imports
import Security from './Security'

const SecurityTab = async () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Security />
      </Grid>
    </Grid>
  )
}

export default SecurityTab
