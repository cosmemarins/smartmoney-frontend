import ComissaoAgentesList from '@/views/financeiro/comissao/mensal/assessores'

const ComissaoAgentesApp = async ({ params }: { params: { token: string; ano: string; mes: string } }) => {
  return <ComissaoAgentesList token={params.token} ano={params.ano} mes={params.mes} />
}

export default ComissaoAgentesApp
