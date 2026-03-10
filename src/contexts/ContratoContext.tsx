'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

import { type ContratoType, type ContratoFilterType } from '@/types/ContratoType'
import type { ResumoContratoType } from '@/types/ResumoContratoType'

interface ContratoContextData {
  contrato?: ContratoType
  setContratoContext: (contrato: ContratoType | undefined) => void
  resumoContrato?: ResumoContratoType
  setResumoContratoContext: (resumoContrato: ResumoContratoType | undefined) => void
  refresh: boolean
  setRefreshContext: (refresh: boolean) => void
  
  contratoFilter?: ContratoFilterType
  setContratoFilterContext: (filter: ContratoFilterType | undefined) => void
  
  globalFilter: string
  setGlobalFilterContext: (filter: string) => void
}

interface Props {
  children: ReactNode
}

export const ContratoContext = createContext<ContratoContextData>({} as ContratoContextData)

export function ContratoProvider({ children }: Props) {
  const [contrato, setContrato] = useState<ContratoType>()
  const [resumoContrato, setResumoContrato] = useState<ResumoContratoType>()
  const [refresh, setRefresh] = useState<boolean>(false)
  
  const [contratoFilter, setContratoFilter] = useState<ContratoFilterType>()
  const [globalFilter, setGlobalFilter] = useState<string>('') // Estado para a pesquisa

  useEffect(() => {
    const savedFilters = sessionStorage.getItem('contrato_filters')
    if (savedFilters) {
      setContratoFilter(JSON.parse(savedFilters))
    } else {
      setContratoFilter({
        status: 'NOVO',
        tipoSaldo: 'TODOS',
        options: { page: 1, orderDirection: 'ASC' }
      })
    }

    const savedGlobalFilter = sessionStorage.getItem('contrato_global_filter')
    if (savedGlobalFilter) {
      setGlobalFilter(savedGlobalFilter)
    }
  }, [])

  const setContratoContext = (contrato: ContratoType | undefined) => {
    setContrato(contrato)
  }

  const setResumoContratoContext = (resumoContrato: ResumoContratoType | undefined) => {
    setResumoContrato(resumoContrato)
  }

  const setRefreshContext = (refresh: boolean) => {
    setRefresh(refresh)
  }

  const setContratoFilterContext = (filter: ContratoFilterType | undefined) => {
    setContratoFilter(filter)
    if (filter) {
      sessionStorage.setItem('contrato_filters', JSON.stringify(filter))
    } else {
      sessionStorage.removeItem('contrato_filters')
    }
  }

  const setGlobalFilterContext = (filter: string) => {
    setGlobalFilter(filter)
    if (filter) {
      sessionStorage.setItem('contrato_global_filter', filter)
    } else {
      sessionStorage.removeItem('contrato_global_filter')
    }
  }

  return (
    <ContratoContext.Provider
      value={{
        contrato,
        setContratoContext,
        resumoContrato,
        setResumoContratoContext,
        refresh,
        setRefreshContext,
        contratoFilter,
        setContratoFilterContext,
        globalFilter,
        setGlobalFilterContext
      }}
    >
      {children}
    </ContratoContext.Provider>
  )
}

export const useContratoContext = () => useContext(ContratoContext)