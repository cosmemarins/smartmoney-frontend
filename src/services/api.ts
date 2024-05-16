'use client'

import type { AxiosError, AxiosResponse } from 'axios'
import axios from 'axios'
import { getCookie } from 'cookies-next'
import { signOut } from 'next-auth/react'

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
  const storedToken = getCookie('token')

  //console.log('interceptors.storedToken', storedToken)

  if (!storedToken) {
    console.log('storedToken vazio, precisa logar novamente')

    signOut({ redirect: false })

    //TODO: implementar metode de refresh token
    window.location.href = `${process.env.NEXT_PUBLIC_APP_URL}/login`
  }

  config.headers.Authorization = `Bearer ${storedToken}`

  return config
}, onRequestError)

api.interceptors.response.use(onResponse, onResponseError)

export default api
