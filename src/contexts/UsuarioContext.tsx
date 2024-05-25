import { createContext, useContext, useState, type ReactNode } from 'react'

import type { UsuarioType } from '@/types/UsuarioType'

interface UsuarioContextData {
  usuario?: UsuarioType
  setUsuarioContext: (usuario: UsuarioType) => void
  loading: boolean
  setLoadingContext: (loading: boolean) => void
}

interface Props {
  children: ReactNode
}

export const UsuarioContext = createContext<UsuarioContextData>({} as UsuarioContextData)

export function UsuarioProvider({ children }: Props) {
  const [usuario, setUsuario] = useState<UsuarioType>()
  const [loading, setLoading] = useState<boolean>(false)

  const setUsuarioContext = (usuario: UsuarioType) => {
    setUsuario(usuario)
  }

  const setLoadingContext = (loading: boolean) => {
    setLoading(loading)
  }

  return (
    <UsuarioContext.Provider value={{ usuario, setUsuarioContext, loading, setLoadingContext }}>
      {' '}
      {children}
    </UsuarioContext.Provider>
  )
}

export const useUsuarioContext = () => useContext(UsuarioContext)
