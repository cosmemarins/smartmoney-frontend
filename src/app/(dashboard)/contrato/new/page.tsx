'use client'

import ContratoPage from '@/views/contrato/wizard'
import { ClienteProvider } from '@/contexts/ClienteContext'

//export default async function UsuarioApp({ params }: Props) {
export default function ContratoApp() {
  return (
    <ClienteProvider>
      <ContratoPage token={undefined} />
    </ClienteProvider>
  )
}
