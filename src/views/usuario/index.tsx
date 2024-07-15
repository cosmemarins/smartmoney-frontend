'use client'

import { useEffect } from 'react'

import Grid from '@mui/material/Grid'

import { Backdrop, CircularProgress } from '@mui/material'

import axios from 'axios'

import { getUsuario } from '@/services/UsuarioService'
import UsuarioEdit from './edit'
import { useUsuarioContext } from '@/contexts/UsuarioContext'
import type { ValidationError } from '@/services/api'

interface Props {
  token: string | undefined
}

const UsuaqioPage = ({ token }: Props) => {
  // States
  const { setUsuarioContext, loading, setLoadingContext } = useUsuarioContext()

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

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} lg={12} md={12}>
        <UsuarioEdit />
      </Grid>
      <Backdrop open={loading} className='absolute text-white z-[cal(var(--mui-zIndex-mobileStepper)-1)]'>
        <CircularProgress color='inherit' />
      </Backdrop>
    </Grid>
  )
}

export default UsuaqioPage
