export default interface UsuarioSenhaDTO {
  // eslint-disable-next-line lines-around-comment
  //quando o proprio usario for alterar a senha dele
  //ele deve informar a senha atual no campo senha
  //quando for alteração de senha pelo admin ou quando for recuperação de senha
  // basta usar os campos apropriados (novaSenha e confirmacaoSenha)
  id: number
  token?: string
  senha: string
  novaSenha: string
  confirmacaoSenha: string
}
