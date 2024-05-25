'use client'

import ClientePage from '@/views/cliente'
import { ClienteProvider } from '@/contexts/ClienteContext'

interface Props {
  params: { token: string }
}

//export default async function ClienteApp({ params }: Props) {
export default function ClienteApp({ params }: Props) {
  return (
    <ClienteProvider>
      <ClientePage token={params.token} />
    </ClienteProvider>
  )
}
