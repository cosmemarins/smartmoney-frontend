'use client'

import { getCookie } from 'cookies-next'
import type { AxiosError, AxiosResponse } from 'axios'
import axios from 'axios'
import { signOut } from 'next-auth/react'

export interface ValidationError {
  message: string
  errors: Record<string, string[]>
}

const onRequestError = (error: AxiosError): Promise<AxiosError> => {
  console.error('onRequestError:', `${error.response?.status} - ${error.response?.statusText}`)

  return Promise.reject(error)
}

const onResponse = (response: AxiosResponse): AxiosResponse => {
  if (response.status === 401) {
    signOut()
  }

  return response
}

const onResponseError = (error: AxiosError): Promise<AxiosError> => {
  console.error('onResponseError:', `${error.response?.status} - ${error.response?.statusText}`)

  return Promise.reject(error)
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_APP_URL_API
})

// Add a request interceptor
api.interceptors.request.use(function (config) {
  // const storedToken = cookies().get('token')?.value
  const storedToken = getCookie('token')

  //console.log('storedToken:', storedToken)
  console.log('config.baseURL', config.baseURL)
  console.log('config.url', config.url)

  if (
    !storedToken &&
    !config.url?.startsWith('usuarios/esqueci-senha') &&
    !config.url?.startsWith('usuarios/token-senha/') &&
    !config.url?.startsWith('usuarios/resetar-senha/')
  ) {
    //console.log('storedToken vazio, precisa logar novamente')

    //signOut({ redirect: false })
    //signOut({ redirect: false, callbackUrl: `${process.env.NEXT_PUBLIC_APP_URL}/login` })
    signOut({ redirect: false }).then(() => {
      window.location.href = `${process.env.NEXT_PUBLIC_APP_URL}/login`
    })

    //TODO: implementar metode de refresh token
    //window.location.href = `${process.env.NEXT_PUBLIC_APP_URL}/login`
  }

  config.headers.Authorization = `Bearer ${storedToken}`

  return config
}, onRequestError)

api.interceptors.response.use(onResponse, onResponseError)

export default api
