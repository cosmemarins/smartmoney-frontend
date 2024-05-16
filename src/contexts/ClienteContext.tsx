import { createContext, useContext, useState, type ReactNode } from 'react'

import { clienteInit, type ClienteType } from '@/types/ClienteType'

interface ClienteContextData {
  cliente: ClienteType
  setClienteContext: (cliente: ClienteType) => void
}

interface Props {
  children: ReactNode
}

export const ClienteContext = createContext<ClienteContextData>({} as ClienteContextData)

export function ClienteProvider({ children }: Props) {
  const [cliente, setCliente] = useState<ClienteType>(clienteInit)

  const setClienteContext = (cliente: ClienteType) => {
    setCliente(cliente)
  }

  return <ClienteContext.Provider value={{ cliente, setClienteContext }}> {children}</ClienteContext.Provider>
}

export const useClienteContext = () => useContext(ClienteContext)
