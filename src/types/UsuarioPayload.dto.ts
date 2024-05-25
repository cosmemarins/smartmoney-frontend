export default interface UsuarioPayloadDTO {
  sub: number;
  token: string;
  nome: string;
  isAdmin: boolean;
  roles: string;
  email: string;
  foto?: string;
  rememberMe: boolean;
  dataUltimoAcesso: Date;
}
