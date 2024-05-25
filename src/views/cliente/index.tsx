'use client'

import { useEffect } from 'react'

import Grid from '@mui/material/Grid'

import { Backdrop, CircularProgress } from '@mui/material'

import axios from 'axios'

import { getCliente } from '@/services/ClienteService'
import ClienteEdit from './edit'
import { useClienteContext } from '@/contexts/ClienteContext'
import type { ValidationError } from '@/services/api'

interface Props {
  token: string | undefined
}

const ClientePage = ({ token }: Props) => {
  // States
  const { setClienteContext, loading, setLoadingContext } = useClienteContext()

  useEffect(() => {
    if (token) {
      setLoadingContext(true)

      getCliente(token)
        .then(respCliente => {
          setClienteContext(respCliente)
          console.log('respCliente', respCliente)
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
        <ClienteEdit />
      </Grid>
      <Backdrop open={loading} className='absolute text-white z-[cal(var(--mui-zIndex-mobileStepper)-1)]'>
        <CircularProgress color='inherit' />
      </Backdrop>
    </Grid>
  )
}

export default ClientePage
