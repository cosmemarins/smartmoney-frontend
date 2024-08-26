// Next Imports
import type { Metadata } from 'next'

// Component Imports
import ResetSenha from '@/views/ResetSenha'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'

export const metadata: Metadata = {
  title: 'Esqueci minha senha',
  description: ''
}

interface Props {
  params: { tokenSenha: string }
}

const ResetSenhaPage = ({ params }: Props) => {
  // Vars
  const mode = getServerMode()

  return <ResetSenha mode={mode} tokenSenha={params.tokenSenha} />
}

export default ResetSenhaPage
