'use client'

import Grid from '@mui/material/Grid'

import TotalClientesCard from './TotalClientesCard'
import TotalEquipeCard from './TotalEquipeCard'
import TotalContratosCard from './TotalContratosCard'

const HomePage = () => {
  // States
  //const [loading, setLoading] = useState(false)

  /*
  useEffect(() => {
    if (token) {
      setLoadingContext(true)

      getUsuario(token)
        .then(respUsuario => {
          setUsuarioContext(respUsuario)

          //console.log('respUsuario', respUsuario)
        })
        .catch(err => {
          if (axios.isAxiosError<ValidationError, Record<string, unknown>>(err)) {
            console.log(err.status)
            console.error(err.response)
          } else {
            console.error(err)
          }
        })
        .finally(() => {
          setLoadingContext(false)
        })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  */
  return (
    <Grid container spacing={6}>
      <Grid item xs={12} sm={6} md={4}>
        <TotalEquipeCard />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <TotalContratosCard />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <TotalClientesCard />
      </Grid>
    </Grid>
  )
}

export default HomePage
