// React Imports
import { useEffect, useState } from 'react'

// Third-party Imports
// @ts-ignore
import { Alert, AlertTitle, Button, Card, CardActions, CardContent, CardHeader, CardMedia } from '@mui/material'

import type { ArquivoType } from '@/types/ArquivoType'
import ArquivoService from '@/services/ArquivoService'
import type { TipoDocumentoEnum } from '@/utils/enums/TipoDocumentoEnum'
import { getTipoDocumentoEnumDesc } from '@/utils/enums/TipoDocumentoEnum'
import { trataErro } from '@/utils/erro'

interface props {
  arquivo: ArquivoType
  handleEditArquivo: any
}

const ArquivoItem = ({ arquivo, handleEditArquivo }: props) => {
  // States
  const [erro, setErro] = useState('')
  const [loadFile, setLoadFile] = useState(false)
  const [fileDocumento, setFileDocumento] = useState<any>()
  const [titulo, setTitulo] = useState('')

  useEffect(() => {
    setTitulo(getTipoDocumentoEnumDesc(arquivo.tipoDocumento as TipoDocumentoEnum))

    if (arquivo?.token) {
      setLoadFile(true)

      //precisa recuperar por aqui pois tem que ser via axios por causa da validação de seção
      ArquivoService.getThumbnail(arquivo.token)
        .then(dataImg => {
          setFileDocumento(dataImg)
        })
        .catch(err => {
          console.log('Erro ao recuperar imagem:', err)
          setErro(trataErro(err))
        })
        .finally(() => {
          setLoadFile(false)
        })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [arquivo])

  return (
    <Card>
      <CardHeader title={titulo} />
      <CardContent>
        {erro && (
          <Alert icon={false} severity='error' onClose={() => {}}>
            <AlertTitle>Erro</AlertTitle>
            {erro}
          </Alert>
        )}
        <CardMedia
          key={arquivo?.token}
          sx={{ minHeight: 250 }}
          image={`data:image/jpeg;base64, ${fileDocumento}`}
          title={titulo}
        />
      </CardContent>
      <CardActions className='card-actions-dense'>
        <small className='w-full '>{arquivo.descricao}</small>
        <Button type='button' variant='contained' className='mie-2' onClick={() => handleEditArquivo(arquivo)}>
          {loadFile ? (
            <>
              <i className='tabler-refresh text-xl' /> aguarde...
            </>
          ) : (
            'Editar'
          )}
        </Button>
      </CardActions>
    </Card>
  )
}

export default ArquivoItem
