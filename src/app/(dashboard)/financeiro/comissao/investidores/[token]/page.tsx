import ComissaoInvestidoresList from '@/views/financeiro/comissao/investidores'

interface Props {
  params: { token: string | undefined }
}

const ComissaoInvestidoresApp = async ({ params }: Props) => {
  return <ComissaoInvestidoresList token={params.token} />
}

export default ComissaoInvestidoresApp
