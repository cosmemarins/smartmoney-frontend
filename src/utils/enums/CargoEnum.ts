export enum CargoEnum {
  SOCIO = 'SOCIO',
  SOCIO_ADMIN = 'SOCIO_ADMIN',
  ADMINISTRATIVO = 'ADMINISTRATIVO',
  FINANCEIRO = 'FINANCEIRO',
  OUTROS = 'OUTROS',
}

export function getCargoEnumDesc(item: string | undefined) {
  switch (item) {
    case CargoEnum.SOCIO:
      return 'sócio';
    case CargoEnum.SOCIO_ADMIN:
      return 'sócio administrativo';
    case CargoEnum.ADMINISTRATIVO:
      return 'administrativo';
    case CargoEnum.FINANCEIRO:
      return 'financeiro';
    case CargoEnum.OUTROS:
      return 'outros';
    default:
      return '';
  }
}

export function getCargoEnumColor(item: string) {
  switch (item) {
    case CargoEnum.SOCIO:
      return 'success';
    case CargoEnum.SOCIO_ADMIN:
      return 'warning';
    case CargoEnum.ADMINISTRATIVO:
      return 'default';
    case CargoEnum.FINANCEIRO:
      return 'default';
    case CargoEnum.OUTROS:
      return 'default';
    default:
      return 'default';
  }
}

export const StausClienteEnumList = [
  { value: 'SOCIO', label: 'Sócio' },
  { value: 'SOCIO_ADMIN', label: 'Sócio Adminsitror' },
  { value: 'ADMINISTRATIVO', label: 'Adminsitrativo' },
  { value: 'FINANCEIRO', label: 'Financeiro' },
];
