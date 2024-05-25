export enum TipoDocumentoEnum {
  IDENTIDADE = 'IDENTIDADE',
  COMPROVANTE_RESIDENCIA = 'COMPROVANTE_RESIDENCIA',
  COMPROVANTE_FINANCEIRO = 'COMPROVANTE_FINANCEIRO',
}

export function getTipoExtratoEnumDesc(item: TipoDocumentoEnum) {
  switch (item) {
    case TipoDocumentoEnum.IDENTIDADE:
      return 'identidade';
    case TipoDocumentoEnum.COMPROVANTE_RESIDENCIA:
      return 'comprovante de residência';
    case TipoDocumentoEnum.COMPROVANTE_FINANCEIRO:
      return 'comprovante financeiro';
    default:
      throw Error(`Valor ${item} inválido`);
  }
}
