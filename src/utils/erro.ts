import axios from 'axios'

import type { ValidationError } from '@/services/api'

export const trataErro = (err: any) => {
  let msgErro = 'Ocorreu um erro ao tentar salvar o registro'

  if (axios.isAxiosError<ValidationError, Record<string, unknown>>(err)) {
    console.log('status', err.status)
    console.error('response', err.response)
    msgErro = err?.response?.request.responseText
  } else {
    console.error(err)
    msgErro = err
  }

  return msgErro
}
