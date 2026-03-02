'use client' // Adicionado para permitir useEffect e sessionStorage

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

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

  globalFilter: string
  setGlobalFilterContext: (filter: string) => void
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

  const [globalFilter, setGlobalFilter] = useState<string>('')

  useEffect(() => {
    const savedGlobalFilter = sessionStorage.getItem('cliente_global_filter')
    if (savedGlobalFilter) {
      setGlobalFilter(savedGlobalFilter)
    }
  }, [])

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

  const setGlobalFilterContext = (filter: string) => {
    setGlobalFilter(filter)
    if (filter) {
      sessionStorage.setItem('cliente_global_filter', filter)
    } else {
      sessionStorage.removeItem('cliente_global_filter')
    }
  }

  return (
    <ClienteContext.Provider 
      value={{ 
        cliente, 
        setClienteContext, 
        loading, 
        setLoadingContext, 
        isCpf, 
        isCnpj,
        globalFilter,
        setGlobalFilterContext
      }}
    >
      {children}
    </ClienteContext.Provider>
  )
}

export const useClienteContext = () => useContext(ClienteContext)