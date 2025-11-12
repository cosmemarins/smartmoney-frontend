import ComissaoAgentesList from '@/views/financeiro/comissao/assessores'

interface Props {
  params: { token: string | undefined }
}

const ComissaoAgentesApp = async ({ params }: Props) => {
  return <ComissaoAgentesList token={params.token} />
}

export default ComissaoAgentesApp
