import { useEffect } from 'react'

import { PerfilUsuarioEnum } from '@/utils/enums/PerfilUsuarioEnum'
import AgenteWizard from './AgenteWizard'
import ColaboradorWizard from './ColaboradorWizard'
import ParceiroWizard from './ParceiroWizard'
import { useEquipeContext } from '@/contexts/EquipeContext'

interface Props {
  perfil: string
}

const EquipeWizard = ({ perfil }: Props) => {
  //contexto
  const { setUsuarioEquipeContext } = useEquipeContext()

  useEffect(() => {
    setUsuarioEquipeContext({
      perfil,
      tipoPessoa:
        perfil != PerfilUsuarioEnum.AGENTE && perfil != PerfilUsuarioEnum.PARCEIRO && perfil != PerfilUsuarioEnum.MASTER
          ? 'F'
          : undefined
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [perfil])

  return (
    <>
      {!perfil ? (
        ''
      ) : perfil === PerfilUsuarioEnum.AGENTE ? (
        <AgenteWizard></AgenteWizard>
      ) : perfil === PerfilUsuarioEnum.PARCEIRO ? (
        <ParceiroWizard></ParceiroWizard>
      ) : (
        <ColaboradorWizard></ColaboradorWizard>
      )}
    </>
  )
}

export default EquipeWizard
