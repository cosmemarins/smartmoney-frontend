export default interface UsuarioPayloadDTO {
  sub: number
  token: string
  nome: string
  tipoPessoa: string
  idParceiro: number
  isAdmin: boolean
  podeCriarEquipe: boolean
  roles: string
  cargo: string
  email: string
  foto?: string
  rememberMe: boolean
  dataUltimoAcesso: Date
}
