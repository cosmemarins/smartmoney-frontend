import DadosBancariosCliente from '@/views/cliente/components/DadosBancariosCliente'

const DadosBancarios = () => {
  const handleNext = () => {}

  const handlePrev = () => {}

  return (
    <DadosBancariosCliente
      activeStep={0}
      steps={[]}
      handleNext={handleNext}
      handlePrev={handlePrev}
    ></DadosBancariosCliente>
  )
}

export default DadosBancarios
