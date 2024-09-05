import DadosBancariosEquipe from '@/views/equipe/components/DadosBancariosEquipe'

const DadosBancarios = () => {
  const handleNext = () => {}

  const handlePrev = () => {}

  return (
    <DadosBancariosEquipe
      activeStep={0}
      steps={[]}
      handleNext={handleNext}
      handlePrev={handlePrev}
    ></DadosBancariosEquipe>
  )
}

export default DadosBancarios
