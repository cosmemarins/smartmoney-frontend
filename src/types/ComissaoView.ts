import type { ComissaoType } from './ComissaoType'
import type { TotaisComissaoType } from './TotaisComissaoType'

export type ComissaoViewType = {
  listComissao: ComissaoType[]
  totaisComissao?: TotaisComissaoType
}
