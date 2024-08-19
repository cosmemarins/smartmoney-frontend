import axios from 'axios'

import type { ValidationError } from '@/services/api'

export const trataErro = (err: any) => {
  let msgErro = 'Ocorreu um erro no sistema'

  if (axios.isAxiosError<ValidationError, Record<string, unknown>>(err)) {
    //console.log('status', err.status)
    //console.error('response', err.response)

    // console.error('request', err?.response?.request)
    const request = err?.response?.request

    if (request.responseType === 'arraybuffer') {
      const decoder = new TextDecoder()

      msgErro = decoder.decode(request.response)
    } else {
      msgErro = request.responseText
    }
  } else {
    console.error(err)
    msgErro = err
  }

  return msgErro
}
