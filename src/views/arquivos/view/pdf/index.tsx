'use client'

// React Imports
import { useEffect, useState } from 'react'

import ArquivoService from '@/services/ArquivoService'

interface props {
  token: string
}

const ArquivoView = ({ token }: props) => {
  // States
  const [fileDocumento, setFileDocumento] = useState<any>()

  useEffect(() => {
    if (token) {
      //precisa recuperar por aqui pois tem que ser via axios por causa da validação de seção
      ArquivoService.getThumbnail(token)
        .then(dataImg => {
          setFileDocumento(dataImg)
        })
        .catch(err => {
          console.log('Erro ao recuperar imagem:', err)
        })
        .finally(() => {})
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  return <img src={`data:image/jpeg;base64, ${fileDocumento}`} />
}

export default ArquivoView
