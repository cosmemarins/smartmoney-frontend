import ComissaoAtgParceiroList from '@/views/financeiro/comissao-atg/parceiros'

interface Props {
  params: { token: string | undefined }
}

const ComissaoAtgParceirosApp = async ({ params }: Props) => {
  return <ComissaoAtgParceiroList token={params.token} />
}

export default ComissaoAtgParceirosApp
