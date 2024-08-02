import { PerfilUsuarioEnum } from '@/utils/enums/PerfilUsuarioEnum'
import UsuarioList from '@views/equipe/list'

const EquipeListApp = async () => {
  return <UsuarioList perfil={PerfilUsuarioEnum.AGENTE} />
}

export default EquipeListApp
