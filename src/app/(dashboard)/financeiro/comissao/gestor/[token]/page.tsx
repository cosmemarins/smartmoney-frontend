import ComissaoGestorList from '@/views/financeiro/comissao/gestor'

interface Props {
  params: { token: string | undefined }
}

const ComissaoGestorApp = async ({ params }: Props) => {
  return <ComissaoGestorList token={params.token} />
}

export default ComissaoGestorApp
