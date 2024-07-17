export const ensurePrefix = (str: string, prefix: string) => (str.startsWith(prefix) ? str : `${prefix}${str}`)

export const withoutSuffix = (str: string, suffix: string) =>
  str.endsWith(suffix) ? str.slice(0, -suffix.length) : str

export const withoutPrefix = (str: string, prefix: string) => (str.startsWith(prefix) ? str.slice(prefix.length) : str)

//gera stringo com letras e numeros
export const geraSenha = () => {
  return Math.random().toString(36).slice(-10)
}

export const cpfCnpjMask = (value: string | undefined) => {
  if (!value) return ''

  let ret: string = ''

  if (value.replace(/\D/g, '').length <= 11) {
    ret = value
      .replace(/\D/g, '') // substitui qualquer caracter que nao seja numero por nada
      .replace(/(\d{3})(\d)/, '$1.$2') // captura 2 grupos de numero o primeiro de 3 e o segundo de 1, apos capturar o primeiro grupo ele adiciona um ponto antes do segundo grupo de numero
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1') // captura 2 numeros seguidos de um traço e não deixa ser digitado mais nada
  } else {
    ret = value
      .replace(/\D+/g, '') // não deixa ser digitado nenhuma letra
      .replace(/(\d{2})(\d)/, '$1.$2') // captura 2 grupos de número o primeiro com 2 digitos e o segundo de com 3 digitos, apos capturar o primeiro grupo ele adiciona um ponto antes do segundo grupo de número
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1/$2') // captura 2 grupos de número o primeiro e o segundo com 3 digitos, separados por /
      .replace(/(\d{4})(\d)/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1') // captura os dois últimos 2 números, com um - antes dos dois números
  }

  return ret
}

export const telefoleMask = (value: string | undefined) => {
  if (!value) return ''
  const tel = value.replace(/\D/g, '')

  if (tel.length > 11) return

  let ret = ''
  let inc = 0
  const mask8 = '(99) 9999-9999'
  const mask9 = '(99) 99999-9999'
  let mask = mask8

  if (tel.length > 10) mask = mask9

  Array.from(tel).forEach((letter, index) => {
    while (!mask[index + inc].match(/[0-9]/)) {
      ret += mask[index + inc]
      inc++
    }

    ret += letter
  })

  return ret
}

//  const optionsValues = { style: 'currency', currency: 'BRL' }
export const valorEmReal = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

export const valorBr = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
