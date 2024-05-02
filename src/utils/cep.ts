export type cepType = {
  cep?: string
  logradouro?: string
  complemento?: string
  bairro?: string
  localidade?: string
  uf?: string
  ibge?: string
  gia?: string
  ddd?: string
  siafi?: string
}

//nao estão funcinonanod e eu nao sei o porque
//nao to conseguindo pegar o return na pagina que chama
export const getCep = (cep: string): cepType | undefined => {
  try {
    console.log('CEP: ', cep)

    if (cep.length < 8) {
      return {}
    } else {
      fetch(`http://viacep.com.br/ws/${cep}/json/`, { mode: 'cors' })
        .then(res => res.json())
        .then(data => {
          if (data.hasOwnProperty('erro')) {
            throw 'CEP não existe'
          } else {
            console.log('DATA: ', data)

            return data
          }
        })
        .catch(err => console.log(err))
    }
  } catch (err) {
    // Throw error
    throw err
  }
}
