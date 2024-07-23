import { createContext, useContext, useState, type ReactNode } from 'react'

import { type ContratoType } from '@/types/ContratoType'
import type { ResumoContratoType } from '@/types/ResumoContratoType'

interface ContratoContextData {
  contrato?: ContratoType
  setContratoContext: (contrato: ContratoType | undefined) => void
  resumoContrato?: ResumoContratoType
  setResumoContratoContext: (resumoContrato: ResumoContratoType | undefined) => void
  refresh: boolean
  setRefreshContext: (refresh: boolean) => void
}

interface Props {
  children: ReactNode
}

export const ContratoContext = createContext<ContratoContextData>({} as ContratoContextData)

export function ContratoProvider({ children }: Props) {
  const [contrato, setContrato] = useState<ContratoType>()
  const [resumoContrato, setResumoContrato] = useState<ResumoContratoType>()
  const [refresh, setRefresh] = useState<boolean>(false)

  const setContratoContext = (contrato: ContratoType | undefined) => {
    setContrato(contrato)
  }

  const setResumoContratoContext = (resumoContrato: ResumoContratoType | undefined) => {
    setResumoContrato(resumoContrato)
  }

  const setRefreshContext = (refresh: boolean) => {
    setRefresh(refresh)
  }

  return (
    <ContratoContext.Provider
      value={{ contrato, setContratoContext, resumoContrato, setResumoContratoContext, refresh, setRefreshContext }}
    >
      {' '}
      {children}
    </ContratoContext.Provider>
  )
}

export const useContratoContext = () => useContext(ContratoContext)
