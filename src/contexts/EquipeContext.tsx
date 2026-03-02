'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

import type { UsuarioType } from '@/types/UsuarioType'
import isCPF from '@/utils/cpf'
import isCNPJ from '@/utils/cnpj'
import type { ResumoUsuarioType } from '@/types/ResumoUsuarioType'

interface EquipeContextData {
  usuarioEquipe?: UsuarioType
  setUsuarioEquipeContext: (usuarioEquipe: UsuarioType) => void
  resumoUsuario?: ResumoUsuarioType
  setResumoUsuarioContext: (resumoUsuario: ResumoUsuarioType | undefined) => void
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

export const EquipeContext = createContext<EquipeContextData>({} as EquipeContextData)

export function EquipeProvider({ children }: Props) {
  const [usuarioEquipe, setUsuarioEquipe] = useState<UsuarioType>()
  const [resumoUsuario, setResumoUsuario] = useState<ResumoUsuarioType>()
  const [loading, setLoading] = useState<boolean>(false)
  const [isCpf, setIsCpf] = useState<boolean>(false)
  const [isCnpj, setIsCnpj] = useState<boolean>(false)
  const [globalFilter, setGlobalFilter] = useState<string>('')

  useEffect(() => {
    const savedGlobalFilter = sessionStorage.getItem('equipe_global_filter')
    if (savedGlobalFilter) {
      setGlobalFilter(savedGlobalFilter)
    }
  }, [])

  const setUsuarioEquipeContext = (usuarioEquipe: UsuarioType) => {
    if (usuarioEquipe && usuarioEquipe.cpfCnpj) {
      if (isCPF(usuarioEquipe.cpfCnpj)) {
        setIsCpf(true)
        setIsCnpj(false)
      } else if (isCNPJ(usuarioEquipe.cpfCnpj)) {
        setIsCnpj(true)
        setIsCpf(false)
      }
    } else {
      setIsCpf(false)
      setIsCnpj(false)
    }

    setUsuarioEquipe(usuarioEquipe)
  }

  const setResumoUsuarioContext = (resumoUsuario: ResumoUsuarioType | undefined) => {
    setResumoUsuario(resumoUsuario)
  }

  const setLoadingContext = (loading: boolean) => {
    setLoading(loading)
  }

  const setGlobalFilterContext = (filter: string) => {
    setGlobalFilter(filter)
    if (filter) {
      sessionStorage.setItem('equipe_global_filter', filter)
    } else {
      sessionStorage.removeItem('equipe_global_filter')
    }
  }

  return (
    <EquipeContext.Provider
      value={{
        usuarioEquipe,
        setUsuarioEquipeContext,
        resumoUsuario,
        setResumoUsuarioContext,
        loading,
        setLoadingContext,
        isCpf,
        isCnpj,
        globalFilter,
        setGlobalFilterContext
      }}
    >
      {children}
    </EquipeContext.Provider>
  )
}

export const useEquipeContext = () => useContext(EquipeContext)