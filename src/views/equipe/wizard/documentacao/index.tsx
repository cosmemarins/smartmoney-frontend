// MUI Imports
import { useEffect, useState } from 'react'

import Grid from '@mui/material/Grid'

// Component Imports
import { Button, Card, CardContent, CardHeader, Dialog, DialogContent, DialogTitle } from '@mui/material'

import { toast } from 'react-toastify'

import ArquivoEdit from './ArquivoEdit'
import type { ArquivoType } from '@/types/ArquivoType'
import ArquivoService from '@/services/ArquivoService'
import { trataErro } from '@/utils/erro'
import ArquivoItem from './ArquivoItem'

import DirectionalIcon from '@/components/DirectionalIcon'
import { TipoArquivoRegistroEnum } from '@/utils/enums/TipoArquivoRegistroEnum'
import { useEquipeContext } from '@/contexts/EquipeContext'
import UsuarioService from '@/services/UsuarioService'

type Props = {
  activeStep: number
  handleNext: () => void
  handlePrev: () => void
  steps: { title: string; subtitle: string }[]
}

const Documentacao = ({ activeStep, handleNext, handlePrev, steps }: Props) => {
  //contexto
  const { usuarioEquipe, setResumoUsuarioContext, setLoadingContext } = useEquipeContext()

  const [openDlgArquivo, setOpenDlgArquivo] = useState<boolean>(false)
  const [tituloDlgArquivo, setTituloDlgArquivo] = useState('Novo Upload de Arquivo')
  const [arquivoList, setArquivoList] = useState<ArquivoType[]>([])
  const [refreshArquivoList, setRefreshArquivoList] = useState<boolean>(true)

  const arquivoInit = {
    data: new Date(),
    tipoRegistro: TipoArquivoRegistroEnum.USUARIO,
    idRegistro: usuarioEquipe?.id,
    tokenRegistro: usuarioEquipe?.token,
    usuario: { id: usuarioEquipe?.id, token: usuarioEquipe?.token, tipoPessoa: usuarioEquipe?.tipoPessoa }
  }

  const [arquivoEdit, setArquivoEdit] = useState<ArquivoType>(arquivoInit)

  const handleNovoArquivo = () => {
    setTituloDlgArquivo('Novo Upload de Arquivo')
    setArquivoEdit(arquivoInit)
    setOpenDlgArquivo(true)
  }

  const handleEditArquivo = (arquivo: ArquivoType) => {
    setTituloDlgArquivo('Edição de Arquivo')
    setArquivoEdit(arquivo)
    setOpenDlgArquivo(true)
  }

  const handleCloseDlgArquivo = () => {
    setOpenDlgArquivo(false)
  }

  const handleProximo = () => {
    if (usuarioEquipe?.token) {
      UsuarioService.getResumo(usuarioEquipe?.token)
        .then(respResumo => {
          console.log('respResumo', respResumo)
          setResumoUsuarioContext(respResumo)

          if (respResumo.podeAtivar) {
            handleNext()
          } else {
            let msgErro = !respResumo.comprovanteResidenciaOk ? 'RG/CNH' : ''

            if (!respResumo.comprovanteResidenciaOk) {
              msgErro += msgErro === '' ? 'comprovante de residência' : ' e comprovante de residência'
            }

            if (usuarioEquipe.tipoPessoa === 'J') {
              if (!respResumo.cartaoCnpjOk) {
                msgErro += msgErro === '' ? 'cartão CNPJ' : ', cartão CNPJ'
              }

              if (!respResumo.contratoSocialOk) {
                msgErro += msgErro === '' ? 'contrato social' : ' e contrato social'
              }
            }

            msgErro = `É preciso enviar a documentação deste usuário para dar continuidade ao cadastro. A documentação que falta é ${msgErro}`
            toast.error(msgErro)
          }
        })
        .catch(err => {
          toast.error(trataErro(err))
        })
        .finally(() => {
          setLoadingContext(false)
        })
    } else {
      toast.error('Nenhum usuário selecionado')
    }
  }

  useEffect(() => {
    setRefreshArquivoList(false)

    if (usuarioEquipe?.token) {
      setLoadingContext(true)

      //atualiza o objeto resumo do contrato
      UsuarioService.getResumo(usuarioEquipe?.token)
        .then(respResumo => {
          console.log('respResumo', respResumo)
          setResumoUsuarioContext(respResumo)
        })
        .catch(err => {
          toast.error(trataErro(err))
        })
        .finally(() => {
          setLoadingContext(false)
        })

      //precisa recuperar por aqui pois tem que ser via axios por causa da validação de seção
      ArquivoService.getListUsuario(usuarioEquipe.token)
        .then(respList => {
          setArquivoList(respList)
        })
        .catch(err => {
          toast.error(trataErro(err))
        })
        .finally(() => {
          setLoadingContext(false)
        })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshArquivoList])

  return (
    <>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <CardHeader
              title='Documentação'
              action={
                <Button
                  variant='contained'
                  startIcon={<i className='tabler-plus' />}
                  onClick={() => handleNovoArquivo()}
                >
                  Upload Arquivo
                </Button>
              }
            />
            <CardContent className='flex flex-col gap-4'>
              <Grid container spacing={4}>
                {arquivoList.map((arquivo, key) => (
                  <Grid key={key} item xs={12} sm={4}>
                    <ArquivoItem
                      arquivo={{
                        ...arquivo,
                        usuario: {
                          id: usuarioEquipe?.id,
                          token: usuarioEquipe?.token,
                          tipoPessoa: usuarioEquipe?.tipoPessoa
                        }
                      }}
                      handleEditArquivo={handleEditArquivo}
                    />
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <div className='flex items-center justify-between'>
            <Button
              variant='contained'
              color='primary'
              disabled={activeStep === 0}
              onClick={handlePrev}
              startIcon={<DirectionalIcon ltrIconClass='tabler-arrow-left' rtlIconClass='tabler-arrow-right' />}
            >
              Anterior
            </Button>
            <Button
              variant='contained'
              color={activeStep === steps.length - 1 ? 'success' : 'primary'}
              onClick={handleProximo}
              endIcon={
                activeStep === steps.length - 1 ? (
                  <i className='tabler-check' />
                ) : (
                  <DirectionalIcon ltrIconClass='tabler-arrow-right' rtlIconClass='tabler-arrow-left' />
                )
              }
            >
              {activeStep === steps.length - 1 ? 'Salvar Parceiro' : 'Próximo'}
            </Button>
          </div>
        </Grid>
      </Grid>
      <Dialog
        maxWidth='md'
        open={openDlgArquivo}
        aria-labelledby='form-dialog-title'
        disableEscapeKeyDown
        onClose={(event, reason) => {
          if (reason !== 'backdropClick') {
            handleCloseDlgArquivo()
          }
        }}
      >
        <DialogTitle id='form-dialog-title'>{tituloDlgArquivo}</DialogTitle>
        <DialogContent>
          <ArquivoEdit
            arquivoData={arquivoEdit}
            handleClose={handleCloseDlgArquivo}
            setRefreshArquivoList={setRefreshArquivoList}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}

export default Documentacao
