'use client'

import UsuarioPage from '@/views/equipe/wizard'
import { UsuarioProvider } from '@/contexts/UsuarioContext'

//export default async function UsuarioApp({ params }: Props) {
export default function UsuarioApp() {
  return (
    <UsuarioProvider>
      <UsuarioPage />
    </UsuarioProvider>
  )
}
