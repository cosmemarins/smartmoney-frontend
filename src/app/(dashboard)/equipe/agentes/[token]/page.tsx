'use client'

import EquipePage from '@/views/equipe'
import { EquipeProvider } from '@/contexts/EquipeContext'

interface Props {
  params: { token: string }
}

//export default async function ClienteApp({ params }: Props) {
export default function ClienteApp({ params }: Props) {
  return (
    <EquipeProvider>
      <EquipePage token={params.token} />
    </EquipeProvider>
  )
}
