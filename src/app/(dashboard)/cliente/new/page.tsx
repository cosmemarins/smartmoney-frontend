// MUI Imports
import Grid from '@mui/material/Grid'

// Component Imports
import ClienteProfile from '@views/cliente/new'

const ClienteProfilePage = async () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12} lg={12} md={12}>
        <ClienteProfile />
      </Grid>
    </Grid>
  )
}

export default ClienteProfilePage
