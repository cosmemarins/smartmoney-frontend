import type ComissaoExtratoType from './ComissaoExtratoType'
import type { TotaisComissaoType } from './TotaisComissaoType'

export type ComissaoExtratoFront = {
  listComissoesExtrato: ComissaoExtratoType[]
  totaisComissao?: TotaisComissaoType
}
