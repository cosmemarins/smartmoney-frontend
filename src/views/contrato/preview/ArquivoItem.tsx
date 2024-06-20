// React Imports
import { useEffect, useState } from 'react'

// Third-party Imports
// @ts-ignore
import { Typography } from '@mui/material'

import type { ArquivoType } from '@/types/ArquivoType'
import ArquivoService from '@/services/ArquivoService'
import type { TipoDocumentoEnum } from '@/utils/enums/TipoDocumentoEnum'
import { getTipoDocumentoEnumDesc } from '@/utils/enums/TipoDocumentoEnum'

interface props {
  arquivo: ArquivoType
}

const ArquivoItem = ({ arquivo }: props) => {
  // States
  const [fileDocumento, setFileDocumento] = useState<any>()
  const [titulo, setTitulo] = useState('')

  useEffect(() => {
    setTitulo(getTipoDocumentoEnumDesc(arquivo.tipoDocumento as TipoDocumentoEnum))

    if (arquivo?.token) {
      //precisa recuperar por aqui pois tem que ser via axios por causa da validação de seção
      ArquivoService.getThumbnail(arquivo.token)
        .then(dataImg => {
          setFileDocumento(dataImg)
        })
        .catch(err => {
          console.log('Erro ao recuperar imagem:', err)
        })
        .finally(() => {})
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [arquivo])

  return (
    <div className='flex flex-col items-center justify-center'>
      <Typography className='mbe-2'>{titulo}</Typography>

      <img alt='iPhone 11 Pro' src={`data:image/jpeg;base64, ${fileDocumento}`} width={200} />
    </div>
  )
}

export default ArquivoItem
