import type ComissaoAgrupadaType from './ComissaoAgrupadaType'
import type { TotaisComissaoType } from './TotaisComissaoType'

export type ComissaoAgrupadaFront = {
  listComissaoAgrupada: ComissaoAgrupadaType[]
  totaisComissao?: TotaisComissaoType
}
