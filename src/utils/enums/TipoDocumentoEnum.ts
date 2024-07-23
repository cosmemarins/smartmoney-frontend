export enum TipoDocumentoEnum {
  ADITIVO = 'ADITIVO',
  APORTE = 'APORTE',
  CARTAO_CNPJ = 'CARTAO_CNPJ',
  COMPROVANTE_RESIDENCIA = 'COMPROVANTE_RESIDENCIA',
  COMPROVANTE_FINANCEIRO = 'COMPROVANTE_FINANCEIRO',
  CONTRATO_SOCIAL = 'CONTRATO_SOCIAL',
  IDENTIDADE = 'IDENTIDADE',
  OUTROS = 'OUTROS'
}

export function getTipoDocumentoEnumDesc(item: TipoDocumentoEnum | string) {
  switch (item) {
    case TipoDocumentoEnum.ADITIVO:
      return 'Aditivo'
    case TipoDocumentoEnum.APORTE:
      return 'Comprovante de transferência'
    case TipoDocumentoEnum.CARTAO_CNPJ:
      return 'Cartão CNPJ'
    case TipoDocumentoEnum.IDENTIDADE:
      return 'Identidade'
    case TipoDocumentoEnum.COMPROVANTE_RESIDENCIA:
      return 'Comprovante de residência'
    case TipoDocumentoEnum.COMPROVANTE_FINANCEIRO:
      return 'Comprovante financeiro'
    case TipoDocumentoEnum.CONTRATO_SOCIAL:
      return 'Contrato social'
    case TipoDocumentoEnum.OUTROS:
      return 'Outros'
    default:
      return ''
  }
}

export const TipoDocumentoEnumList = [
  { value: 'ADITIVO', label: 'Aditivo', tipoPessoa: 'E' },
  { value: 'APORTE', label: 'Comprovante de transferência', tipoPessoa: 'A' },
  { value: 'CARTAO_CNPJ', label: 'Cartão CNPJ', tipoPessoa: 'J' },
  { value: 'COMPROVANTE_RESIDENCIA', label: 'Comprovante de residência', tipoPessoa: 'F' },
  { value: 'CONTRATO_SOCIAL', label: 'Contrato Social', tipoPessoa: 'J' },
  { value: 'IDENTIDADE', label: 'Identidade', tipoPessoa: 'F' },
  { value: 'IDENTIDADE', label: 'RG ou CNH do sócio administrador', tipoPessoa: 'J' },
  { value: 'OUTROS', label: 'Outros', tipoPessoa: 'A' }
]

export const TipoDocumentoPessoFisicaEnumList = [
  { value: 'APORTE', label: 'Comprovante de transferência' },
  { value: 'COMPROVANTE_RESIDENCIA', label: 'Comprovante de residência' },
  { value: 'IDENTIDADE', label: 'Identidade' },
  { value: 'OUTROS', label: 'Outros' }
]

export const TipoDocumentoPessoaJuridicaEnumList = [
  { value: 'APORTE', label: 'Comprovante de transferência' },
  { value: 'CARTAO_CNPJ', label: 'Cartão CNPJ' },
  { value: 'COMPROVANTE_RESIDENCIA', label: 'Comprovante de residência' },
  { value: 'CONTRATO_SOCIAL', label: 'Contrato Social' },
  { value: 'IDENTIDADE', label: 'RG ou CNH do sócio administrador' },
  { value: 'OUTROS', label: 'Outros' }
]

export const TipoDocumentoExtratoEnumList = [
  { value: 'APORTE', label: 'Comprovante de transferência' },
  { value: 'ADITIVO', label: 'Aditivo' }
]
