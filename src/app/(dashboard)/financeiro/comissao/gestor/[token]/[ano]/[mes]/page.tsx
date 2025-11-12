import ComissaoGestorList from '@/views/financeiro/comissao/gestor'

const ComissaoGestorApp = async ({ params }: { params: { token: string; ano: string; mes: string } }) => {
  return <ComissaoGestorList token={params.token} ano={params.ano} mes={params.mes} />
}

export default ComissaoGestorApp
