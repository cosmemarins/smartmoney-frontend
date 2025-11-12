import ComissaoInvestidoresList from '@/views/financeiro/comissao/investidores'

const ComissaoInvestidoresApp = async ({ params }: { params: { token: string; ano: string; mes: string } }) => {
  return <ComissaoInvestidoresList token={params.token} ano={params.ano} mes={params.mes} />
}

export default ComissaoInvestidoresApp
