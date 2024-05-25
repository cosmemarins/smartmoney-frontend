import 'next-auth/jwt'
import type { DefaultSession } from 'next-auth'

declare module 'next-auth/jwt' {
  interface JWT {
    id: number
    token: string
    nome: string
    isAdmin: boolean
    roles: string
    email: string
    foto?: string
    rememberMe: boolean
    dataUltimoAcesso: Date
    role?: string
  }
}

declare module 'next-auth' {
  interface Session {
    user: {
      id: number
      token: string
      nome: string
      isAdmin: boolean
      roles: string
      email: string
      foto?: string
      rememberMe: boolean
      dataUltimoAcesso: Date
      role?: string
    } & DefaultSession['user']
  }

  interface User {
    id: number
    token: string
    nome: string
    isAdmin: boolean
    roles: string
    email: string
    foto?: string
    rememberMe: boolean
    dataUltimoAcesso: Date
    role?: string
  }
}
