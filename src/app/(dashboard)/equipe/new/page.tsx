'use client'

import ParceiroPage from '@/views/equipe/wizard'
import { ParceiroProvider } from '@/contexts/ParceiroContext'

//export default async function UsuarioApp({ params }: Props) {
export default function UsuarioApp() {
  return (
    <ParceiroProvider>
      <ParceiroPage />
    </ParceiroProvider>
  )
}
