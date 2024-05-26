import { createContext, useContext, useState, type ReactNode } from 'react'

import { type ContratoType } from '@/types/ContratoType'

interface ContratoContextData {
  contrato?: ContratoType
  setContratoContext: (contrato: ContratoType | undefined) => void
  refresh: boolean
  setRefreshContext: (refresh: boolean) => void
}

interface Props {
  children: ReactNode
}

export const ContratoContext = createContext<ContratoContextData>({} as ContratoContextData)

export function ContratoProvider({ children }: Props) {
  const [contrato, setContrato] = useState<ContratoType>()
  const [refresh, setRefresh] = useState<boolean>(false)

  const setContratoContext = (contrato: ContratoType | undefined) => {
    setContrato(contrato)
  }

  const setRefreshContext = (refresh: boolean) => {
    setRefresh(refresh)
  }

  return (
    <ContratoContext.Provider value={{ contrato, setContratoContext, refresh, setRefreshContext }}>
      {' '}
      {children}
    </ContratoContext.Provider>
  )
}

export const useContratoContext = () => useContext(ContratoContext)
