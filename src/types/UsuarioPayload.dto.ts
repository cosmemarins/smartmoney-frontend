export default interface UsuarioPayloadDTO {
  sub: number
  token: string
  nome: string
  tipoPessoa: string
  isAdmin: boolean
  podeCriarEquipe: boolean
  roles: string
  email: string
  foto?: string
  rememberMe: boolean
  dataUltimoAcesso: Date
}
