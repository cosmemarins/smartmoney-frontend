// Next Imports
import type { Metadata } from 'next'

// Component Imports
import EsqueciSenha from '@/views/EsqueciSenha'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'

export const metadata: Metadata = {
  title: 'Esqueci minha senha',
  description: ''
}

const EsqueciSenhaPage = () => {
  // Vars
  const mode = getServerMode()

  return <EsqueciSenha mode={mode} />
}

export default EsqueciSenhaPage
