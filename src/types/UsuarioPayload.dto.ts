export default interface UsuarioPayloadDTO {
  sub: number
  token: string
  nome: string
  tipoPessoa: string
  idGestor: number
  tokenGestor: string
  isAdmin: boolean
  podeCriarEquipe: boolean
  roles: string
  perfil: string
  email: string
  foto?: string
  rememberMe: boolean
  dataUltimoAcesso: Date
}
