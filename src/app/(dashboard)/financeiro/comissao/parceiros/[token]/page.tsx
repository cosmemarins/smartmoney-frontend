import ComissaoParceiroList from '@/views/financeiro/comissao/parceiros'

interface Props {
  params: { token: string | undefined }
}

const ComissaoParceirosApp = async ({ params }: Props) => {
  return <ComissaoParceiroList token={params.token} />
}

export default ComissaoParceirosApp
