import ComissaoParceiroList from '@/views/financeiro/comissao/mensal/parceiros'

interface Props {
  params: { token: string | undefined }
}

const ComissaoParceirosApp = async ({ params }: Props) => {
  return <ComissaoParceiroList token={params.token} />
}

export default ComissaoParceirosApp
