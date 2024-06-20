// MUI Imports
import { useEffect, useState } from 'react'

import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'

// Component Imports
import { Button, CircularProgress } from '@mui/material'

import { useSession } from 'next-auth/react'

import CustomAvatar from '@core/components/mui/Avatar'
import { getTotalUsuarios } from '@/services/UsuarioService'
import { trataErro } from '@/utils/erro'
import type TamanhoEquipeDTO from '@/types/TamanhoEquipe.dto'

const TotalEquipeCard = () => {
  const [tamanhoEquipe, setTamanhoEquipe] = useState<TamanhoEquipeDTO>({ totalMinhaEquipe: 0, totalOutrosDaEquipe: 0 })
  const [loading, setLoading] = useState(true)

  const { data: session } = useSession()

  useEffect(() => {
    const user = session?.user

    if (user && user.token) {
      setLoading(true)

      getTotalUsuarios(user.token)
        .then(resp => {
          setTamanhoEquipe(resp)
        })
        .catch(err => {
          trataErro(err)
        })
        .finally(() => {
          setLoading(false)
        })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Card>
      <CardHeader
        title='Equipe'
        action={
          <Button variant='contained' startIcon={<i className='tabler-plus' />} href={`/equipe/new`}>
            Novo Parceiro
          </Button>
        }
      />
      <CardContent className='flex justify-between flex-wrap gap-4 md:pbs-10 max-md:pbe-6 max-[1060px]:pbe-[74px] max-[1200px]:pbe-[52px] max-[1320px]:pbe-[74px] max-[1501px]:pbe-[52px]'>
        {loading ? (
          <div className='flex items-center flex-col' style={{ cursor: 'pointer' }}>
            <CircularProgress />
          </div>
        ) : (
          <Grid container spacing={4}>
            <Grid item xs className='flex items-center gap-4'>
              <CustomAvatar color='info' variant='rounded' size={40} skin='light'>
                <i className='tabler-users'></i>
              </CustomAvatar>
              <div className='flex flex-col'>
                <Typography variant='h5'>{tamanhoEquipe.totalMinhaEquipe}</Typography>
                <Typography variant='body2'>Minha equipe</Typography>
              </div>
            </Grid>
            <Grid item xs className='flex items-center gap-4'>
              <CustomAvatar color='info' variant='rounded' size={40} skin='light'>
                <i className='tabler-users'></i>
              </CustomAvatar>
              <div className='flex flex-col'>
                <Typography variant='h5'>{tamanhoEquipe.totalOutrosDaEquipe}</Typography>
                <Typography variant='body2'>Outras equipes</Typography>
              </div>
            </Grid>
          </Grid>
        )}
      </CardContent>
    </Card>
  )
}

export default TotalEquipeCard
