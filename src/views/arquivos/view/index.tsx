'use client'

// React Imports
import { useEffect, useState } from 'react'

import ArquivoService from '@/services/ArquivoService'
import ReactPdf from '@/components/pdf/ReactPdf'

interface props {
  token: string
  tipo?: string
}

const ArquivoView = ({ token }: props) => {
  // States
  const [fileDocumento, setFileDocumento] = useState<any>()
  const [msgAguarde, setMsgAguarde] = useState<string>('Aguarde...')

  useEffect(() => {
    if (token) {
      //precisa recuperar por aqui pois tem que ser via axios por causa da validação de seção
      ArquivoService.getFile(token)
        .then(dataImg => {
          setFileDocumento(dataImg)
          !dataImg && setMsgAguarde('Arquivo não localizado.')
        })
        .catch(err => {
          console.log('Erro ao recuperar imagem:', err)
        })
        .finally(() => {})
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  return fileDocumento ? (
    fileDocumento.indexOf('JVBERi0') === 0 ? (
      <ReactPdf base64Content={fileDocumento} fileName={`${token}.pdf`} />
    ) : (
      <img src={`data:image/jpeg;base64, ${fileDocumento}`} />
    )
  ) : (
    <p>{msgAguarde}</p>
  )
}

export default ArquivoView
