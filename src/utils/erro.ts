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
    msgErro = err

    try {
      const msgObj = JSON.parse(err)

      if (msgObj.message) {
        msgErro = msgObj.message.constructor === Array ? msgObj.message[0] : msgObj.message
      } else {
        msgErro = `Erro: ${err}`
      }
    } catch (e) {
      console.error('erro nao tratado: ' + err)
    }
  }

  return msgErro
}
