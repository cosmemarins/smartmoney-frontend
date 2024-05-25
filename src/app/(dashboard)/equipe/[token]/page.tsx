'use client'

import UsuarioPage from '@/views/equipe'
import { UsuarioProvider } from '@/contexts/UsuarioContext'

interface Props {
  params: { token: string }
}

//export default async function ClienteApp({ params }: Props) {
export default function ClienteApp({ params }: Props) {
  return (
    <UsuarioProvider>
      <UsuarioPage token={params.token} />
    </UsuarioProvider>
  )
}
