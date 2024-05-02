'use client'

import type { AxiosError, AxiosResponse } from 'axios'
import axios from 'axios'
import { getCookie } from 'cookies-next'
import { signOut } from 'next-auth/react'

const onRequestError = (error: AxiosError): Promise<AxiosError> => {
  console.error(error.toJSON())

  return Promise.reject(error)
}

const onResponse = (response: AxiosResponse): AxiosResponse => {
  if (response.status === 401) {
    signOut()
  }

  return response
}

const onResponseError = (error: AxiosError): Promise<AxiosError> => {
  console.error(error.toJSON())

  return Promise.reject(error)
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_APP_URL_API
})

// Add a request interceptor
api.interceptors.request.use(function (config) {
  const storedToken = getCookie('token')

  console.log('storedToken', storedToken)

  config.headers.Authorization = `Bearer ${storedToken}`

  return config
}, onRequestError)

api.interceptors.response.use(onResponse, onResponseError)

export default api
