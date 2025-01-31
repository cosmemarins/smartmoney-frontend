'use client'

import Grid from '@mui/material/Grid'

// Type Imports
import { useSession } from 'next-auth/react'

import TotalClientesCard from './TotalClientesCard'
import TotalEquipeCard from './TotalEquipeCard'
import TotalContratosCard from './TotalContratosCard'
import ContratosPendentes from '../contrato/components/ContratosPendentes'
import ContratosValoresPendentes from '../contrato/components/ContratosValoresPendentes'
import LastAditivos from '../extrato/components/LastAditivos'
import LastAportes from '../extrato/components/LastAportes'

const HomePage = () => {
  const { data: session } = useSession()

  // States
  //const [loading, setLoading] = useState(false)

  /*
  useEffect(() => {
    if (token) {
      setLoadingContext(true)

      UsuarioService.get(token)
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
      {session?.user.podeCriarEquipe && (
        <Grid item xs={12} sm={6} md={4}>
          <TotalEquipeCard />
        </Grid>
      )}
      <Grid item xs={12} sm={6} md={4}>
        <TotalContratosCard />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <TotalClientesCard />
      </Grid>
      <Grid item xs={12} md={6}>
        <ContratosValoresPendentes />
      </Grid>
      <Grid item xs={12} md={6}>
        <ContratosPendentes />
      </Grid>
      <Grid item xs={12} md={6}>
        <LastAportes />
      </Grid>
      <Grid item xs={12} md={6}>
        <LastAditivos />
      </Grid>
    </Grid>
  )
}

export default HomePage
