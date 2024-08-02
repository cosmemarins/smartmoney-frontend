'use client'

import EquipeWizard from '@/views/equipe/wizard'
import { EquipeProvider } from '@/contexts/EquipeContext'
import { PerfilUsuarioEnum } from '@/utils/enums/PerfilUsuarioEnum'

//export default async function UsuarioApp({ params }: Props) {
export default function UsuarioApp() {
  return (
    <EquipeProvider>
      <EquipeWizard perfil={PerfilUsuarioEnum.PARCEIRO} />
    </EquipeProvider>
  )
}
