import { createContext, useContext, useState, type ReactNode } from 'react'

import type { ParceiroType } from '@/types/ParceiroType'

interface ParceiroContextData {
  parceiro?: ParceiroType
  setParceiroContext: (parceiro: ParceiroType) => void
  loading: boolean
  setLoadingContext: (loading: boolean) => void
}

interface Props {
  children: ReactNode
}

export const ParceiroContext = createContext<ParceiroContextData>({} as ParceiroContextData)

export function ParceiroProvider({ children }: Props) {
  const [parceiro, setparceiro] = useState<ParceiroType>()
  const [loading, setLoading] = useState<boolean>(false)

  const setParceiroContext = (parceiro: ParceiroType) => {
    setparceiro(parceiro)
  }

  const setLoadingContext = (loading: boolean) => {
    setLoading(loading)
  }

  return (
    <ParceiroContext.Provider value={{ parceiro, setParceiroContext, loading, setLoadingContext }}>
      {' '}
      {children}
    </ParceiroContext.Provider>
  )
}

export const useParceiroContext = () => useContext(ParceiroContext)
