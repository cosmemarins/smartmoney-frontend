// React Imports
import { useEffect, useState } from 'react'

// Third-party Imports
// @ts-ignore
import { Alert, AlertTitle, Button, Card, CardActions, CardContent, CardHeader, IconButton } from '@mui/material'

import type { ArquivoType } from '@/types/ArquivoType'
import ArquivoService from '@/services/ArquivoService'
import { TipoDocumentoEnum, getTipoDocumentoEnumDesc } from '@/utils/enums/TipoDocumentoEnum'
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
  const [msgAguarde, setMsgAguarde] = useState<string>('Aguarde...')

  const download = () => {
    const pom = document.createElement('a')

    pom.setAttribute('href', 'data:application/pdf;base64,' + fileDocumento)
    pom.setAttribute('download', arquivo?.token || 'documentacao.pdf')

    if (document.createEvent) {
      const event = document.createEvent('MouseEvents')

      event.initEvent('click', true, true)
      pom.dispatchEvent(event)
    } else {
      pom.click()
    }
  }

  useEffect(() => {
    setTitulo(getTipoDocumentoEnumDesc(arquivo.tipoDocumento as TipoDocumentoEnum))

    if (arquivo?.token) {
      setLoadFile(true)

      //precisa recuperar por aqui pois tem que ser via axios por causa da validação de seção
      ArquivoService.getFile(arquivo.token)
        .then(dataImg => {
          setFileDocumento(dataImg)
          !dataImg && setMsgAguarde('Arquivo não localizado.')
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
  }, [])

  return (
    <Card>
      <CardHeader
        title={titulo}
        action={
          fileDocumento &&
          fileDocumento.indexOf('JVBERi0') === 0 && (
            <IconButton
              onClick={download}
              title='clique para fazer o download do documento'
              sx={{ marginLeft: '70px' }}
            >
              <i className='tabler-download'></i>
            </IconButton>
          )
        }
      />
      <CardContent sx={{ textAlign: 'center' }}>
        {erro && (
          <Alert icon={false} severity='error' onClose={() => {}}>
            <AlertTitle>Erro</AlertTitle>
            {erro}
          </Alert>
        )}
        {fileDocumento ? (
          fileDocumento.indexOf('JVBERi0') === 0 ? (
            <>
              <a target='_blank' href={`/arquivos/${arquivo.token}/view`} rel='noopener noreferrer'>
                <IconButton title='clique para vizualizar o pdf' sx={{ marginRight: '20px' }}>
                  <i className='tabler-eye' style={{ height: '80px', width: '80px' }}></i>
                </IconButton>
              </a>
              <IconButton onClick={download} title='clique para fazer o download do documento'>
                <i className='tabler-download' style={{ height: '80px', width: '80px' }}></i>
              </IconButton>
            </>
          ) : (
            <a target='_blank' href={`/arquivos/${arquivo.token}/view`} rel='noopener noreferrer'>
              <img
                key={arquivo?.token}
                src={`data:image/jpeg;base64, ${fileDocumento}`}
                style={{ maxHeight: 460 }}
                title={titulo}
              />
            </a>
          )
        ) : (
          <p>{msgAguarde}</p>
        )}
      </CardContent>
      <CardActions className='card-actions-dense'>
        <small className='w-full '>{arquivo.descricao}</small>
        {arquivo.tipoDocumento != TipoDocumentoEnum.ADITIVO && arquivo.tipoDocumento != TipoDocumentoEnum.APORTE && (
          <Button type='button' variant='contained' className='mie-2' onClick={() => handleEditArquivo(arquivo)}>
            {loadFile ? (
              <>
                <i className='tabler-refresh text-xl' /> aguarde...
              </>
            ) : (
              'Editar'
            )}
          </Button>
        )}
      </CardActions>
    </Card>
  )
}

export default ArquivoItem
