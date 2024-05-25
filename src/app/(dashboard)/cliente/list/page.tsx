// MUI Imports
import Grid from '@mui/material/Grid'

// Component Imports
import ClienteList from '@views/cliente/list'

const ClienteApp = async () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12} lg={12} md={12}>
        <ClienteList />
      </Grid>
    </Grid>
  )
}

export default ClienteApp
