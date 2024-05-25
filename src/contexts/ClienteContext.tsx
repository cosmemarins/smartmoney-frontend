import { createContext, useContext, useState, type ReactNode } from 'react'

import { type ClienteType } from '@/types/ClienteType'

interface ClienteContextData {
  cliente?: ClienteType
  setClienteContext: (cliente: ClienteType) => void
  loading: boolean
  setLoadingContext: (loading: boolean) => void
}

interface Props {
  children: ReactNode
}

export const ClienteContext = createContext<ClienteContextData>({} as ClienteContextData)

export function ClienteProvider({ children }: Props) {
  const [cliente, setCliente] = useState<ClienteType>()
  const [loading, setLoading] = useState<boolean>(false)

  const setClienteContext = (cliente: ClienteType) => {
    setCliente(cliente)
  }

  const setLoadingContext = (loading: boolean) => {
    setLoading(loading)
  }

  return (
    <ClienteContext.Provider value={{ cliente, setClienteContext, loading, setLoadingContext }}>
      {' '}
      {children}
    </ClienteContext.Provider>
  )
}

export const useClienteContext = () => useContext(ClienteContext)
