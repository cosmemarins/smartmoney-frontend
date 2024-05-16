const isCPF = (value: string) => {
  // Se não for string, o CPF é inválido
  if (typeof value !== 'string') return false

  // Tirar formatação
  const cpf = value.replace(/[^\d]+/g, '')

  // Validar se tem tamanho 11 ou se é uma sequência de digitos repetidos
  if (cpf.length !== 11 || !!cpf.match(/(\d)\1{10}/)) return false

  let soma = 0
  let resto

  for (let i = 1; i <= 9; i++) soma = soma + parseInt(cpf.substring(i - 1, i)) * (11 - i)
  resto = (soma * 10) % 11
  if (resto == 10 || resto == 11) resto = 0
  if (resto != parseInt(cpf.substring(9, 10))) return false
  soma = 0
  for (let i = 1; i <= 10; i++) soma = soma + parseInt(cpf.substring(i - 1, i)) * (12 - i)
  resto = (soma * 10) % 11
  if (resto == 10 || resto == 11) resto = 0
  if (resto != parseInt(cpf.substring(10, 11))) return false

  return true
}

export default isCPF
