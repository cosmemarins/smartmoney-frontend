import Link from 'next/link'

import { Typography } from '@mui/material'

const AvisoLegal = () => {
  return (
    <div className='flex flex-col gap-y-1'>
      <Typography align='justify' color='text.primary' gutterBottom={true}>
        <b>Finalidade desse formulário:</b> As informações aqui inseridas pelo solicitante serão utilizadas
        exclusivamente para conferência e encaminhamento ao ICA BANK com a finalidade de apresentar o interesse na
        contratação do Investimento ICA INVEST na modalidade P2P. As regras e condições serão estabelecidas através de
        contrato enviado posteriormente pelo ICA BANK ao solicitante.
      </Typography>
      <Typography align='justify' color='text.primary' gutterBottom={true}>
        Essa proposta será analisada através de procedimentos previstos nos manuais de PLDFT (Políticas de Prevenção
        contra Lavagem de Dinheiro e Financiamento ao Terrorismo) da Smart Money Group Consultoria. Os dados aqui
        preenchidos devem ser verídicos e se necessário, comprovados através de documentações que poderão ser
        solicitadas avulsamente durante o processo de compliance da proposta.
      </Typography>
      <Typography align='justify' color='text.primary' gutterBottom={true}>
        Os manuais de políticas da ICA BANK podem ser encontrados no site{' '}
        <Link href='https://www.icabank.com.br' target='_blank' className='text-primary'>
          www.ica bank.com.br
        </Link>
        .
      </Typography>
      <Typography align='justify' color='text.primary' gutterBottom={true}>
        Dúvidas podem ser esclarecidas através do email: adm@smartmoneygroup.com.br.
      </Typography>
      <Typography align='justify' color='text.primary' gutterBottom={true}>
        O ICA BANK tem suas próprias políticas, podendo solicitar informações ou documentações que excedam às
        solicitadas pela Smart Money Group Consultoria.
      </Typography>
    </div>
  )
}

export default AvisoLegal
