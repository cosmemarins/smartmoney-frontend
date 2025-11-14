import ComissaoParceiroList from '@/views/financeiro/comissao/mensal/parceiros'

const ComissaoParceirosApp = async ({ params }: { params: { token: string; ano: string; mes: string } }) => {
  return <ComissaoParceiroList token={params.token} ano={params.ano} mes={params.mes} />
}

export default ComissaoParceirosApp
