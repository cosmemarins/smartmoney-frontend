import ArquivoView from '@/views/arquivos/view'

const ArquivoViewApp = async ({ params }: { params: { token: string } }) => {
  return <ArquivoView token={params.token} />
}

export default ArquivoViewApp
