'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { ExtratoFilterType } from '@/types/ExtratoType'

interface ExtratoContextData {
  ExtratoFilter?: ExtratoFilterType
  setExtratoFilterContext: (filter: ExtratoFilterType | undefined) => void
  globalFilter: string
  setGlobalFilterContext: (filter: string) => void
}

interface Props {
  children: ReactNode
}

export const ExtratoContext = createContext<ExtratoContextData>({} as ExtratoContextData)

export function ExtratoProvider({ children }: Props) {
  const [ExtratoFilter, setExtratoFilter] = useState<ExtratoFilterType>()
  const [globalFilter, setGlobalFilter] = useState<string>('')

  useEffect(() => {
    const savedFilters = sessionStorage.getItem('extrato_filters')
    if (savedFilters) {
      setExtratoFilter(JSON.parse(savedFilters))
    } else {
      setExtratoFilter({
        status: 'TODOS',
        tipo: 'TODOS',
        options: { page: 1, orderDirection: 'ASC' }
      })
    }

    const savedGlobalFilter = sessionStorage.getItem('extrato_global_filter')
    if (savedGlobalFilter) {
      setGlobalFilter(savedGlobalFilter)
    }
  }, [])

  const setExtratoFilterContext = (filter: ExtratoFilterType | undefined) => {
    setExtratoFilter(filter)
    if (filter) {
      sessionStorage.setItem('extrato_filters', JSON.stringify(filter))
    } else {
      sessionStorage.removeItem('extrato_filters')
    }
  }

  const setGlobalFilterContext = (filter: string) => {
    setGlobalFilter(filter)
    if (filter) {
      sessionStorage.setItem('extrato_global_filter', filter)
    } else {
      sessionStorage.removeItem('extrato_global_filter')
    }
  }

  return (
    <ExtratoContext.Provider
      value={{
        ExtratoFilter,
        setExtratoFilterContext,
        globalFilter,
        setGlobalFilterContext
      }}
    >
      {children}
    </ExtratoContext.Provider>
  )
}

export const useExtratoContext = () => useContext(ExtratoContext)