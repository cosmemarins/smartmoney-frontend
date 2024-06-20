// Component Imports
import ContratoPrint from '@/views/contrato/print'

const ContratoPrintPage = async ({ params }: { params: { token: string } }) => {
  return <ContratoPrint token={params.token} />
}

export default ContratoPrintPage
