'use client'

// MUI Imports
import Grid from '@mui/material/Grid'

import api from '@/services/api'

// Accessing user data with the role field
const getList = async () => {
  // Vars

  const { data } = await api.get('/usuarios')

  console.log('DATA', data)

  return data
}

const EquipeList = () => {
  // Inside your component...
  const data = getList()

  console.log('DATA', data)

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        1
      </Grid>
    </Grid>
  )
}

export default EquipeList
