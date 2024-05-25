'use client'

import ClientePage from '@/views/cliente'
import { ClienteProvider } from '@/contexts/ClienteContext'

//export default async function ClienteApp({ params }: Props) {
export default function ClienteApp() {
  return (
    <ClienteProvider>
      <ClientePage token={undefined} />
    </ClienteProvider>
  )
}
