'use client'

import { useEffect } from 'react'

import Grid from '@mui/material/Grid'

import { Backdrop, CircularProgress } from '@mui/material'

import axios from 'axios'

import UsuarioService from '@/services/UsuarioService'
import EquipeEdit from './edit'
import { useEquipeContext } from '@/contexts/EquipeContext'
import type { ValidationError } from '@/services/api'

interface Props {
  token: string | undefined
}

const EquipePage = ({ token }: Props) => {
  // States
  const { setUsuarioEquipeContext, loading, setLoadingContext } = useEquipeContext()

  useEffect(() => {
    if (token) {
      setLoadingContext(true)

      UsuarioService.get(token)
        .then(respUsuario => {
          setUsuarioEquipeContext(respUsuario)

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

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} lg={12} md={12}>
        <EquipeEdit />
      </Grid>
      <Backdrop open={loading} className='absolute text-white z-[cal(var(--mui-zIndex-mobileStepper)-1)]'>
        <CircularProgress color='inherit' />
      </Backdrop>
    </Grid>
  )
}

export default EquipePage
