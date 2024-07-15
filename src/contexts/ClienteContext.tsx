import { createContext, useContext, useState, type ReactNode } from 'react'

import { type ClienteType } from '@/types/ClienteType'
import isCPF from '@/utils/cpf'
import isCNPJ from '@/utils/cnpj'

interface ClienteContextData {
  cliente?: ClienteType
  setClienteContext: (cliente: ClienteType) => void
  loading: boolean
  setLoadingContext: (loading: boolean) => void
  isCpf: boolean
  isCnpj: boolean
}

interface Props {
  children: ReactNode
}

export const ClienteContext = createContext<ClienteContextData>({} as ClienteContextData)

export function ClienteProvider({ children }: Props) {
  const [cliente, setCliente] = useState<ClienteType>()
  const [loading, setLoading] = useState<boolean>(false)
  const [isCpf, setIsCpf] = useState<boolean>(false)
  const [isCnpj, setIsCnpj] = useState<boolean>(false)

  const setClienteContext = (cliente: ClienteType) => {
    if (cliente && cliente.cpfCnpj) {
      if (isCPF(cliente.cpfCnpj)) {
        setIsCpf(true)
        setIsCnpj(false)
      } else if (isCNPJ(cliente.cpfCnpj)) {
        setIsCnpj(true)
        setIsCpf(false)
      }
    } else {
      setIsCpf(false)
      setIsCnpj(false)
    }

    setCliente(cliente)
  }

  const setLoadingContext = (loading: boolean) => {
    setLoading(loading)
  }

  return (
    <ClienteContext.Provider value={{ cliente, setClienteContext, loading, setLoadingContext, isCpf, isCnpj }}>
      {' '}
      {children}
    </ClienteContext.Provider>
  )
}

export const useClienteContext = () => useContext(ClienteContext)
