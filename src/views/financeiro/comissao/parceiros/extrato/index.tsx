'use client'

import { useEffect, useState } from 'react'

import moment, { locale } from 'moment'
import 'moment/locale/pt-br'

import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { Button, Card, CardHeader, Chip, MenuItem, styled } from '@mui/material'

import { toast } from 'react-toastify'

import type { ComissaoType } from '@/types/ComissaoType'
import { valorBr } from '@/utils/string'
import { trataErro } from '@/utils/erro'
import FinanceiroService from '@/services/FinanceiroService'
import UsuarioService from '@/services/UsuarioService'
import type { UsuarioType } from '@/types/UsuarioType'
import { getTipoExtratoEnumColor, getTipoExtratoEnumDesc } from '@/utils/enums/TipoExtratoEnum'
import CustomTextField from '@/@core/components/mui/TextField'

locale('pt-br')

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover
  },

  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0
  }
}))

interface props {
  token: string
  ano: number
  mes: number
}

export default function ExtratoComissaoParceiro({ token, ano, mes }: props) {
  //const [saldo, setSaldo] = useState<number>(0)
  const [parceiro, setParceiro] = useState<UsuarioType>()
  const [comissaoList, setComissaoList] = useState<ComissaoType[]>([])
  const [dataCreditoEquipe, setDataCreditoEquipe] = useState<string>()
  const [listParceiros, setListParceiros] = useState<UsuarioType[]>([])

  const [comissaoFilter, setComissaoFilter] = useState({
    token: token || 'todos',
    mes: mes || 'todos',
    ano: ano || 'todos'
  })

  let countItens = 0
  let totalAporte = 0
  let totalBruto = 0
  let totalIR = 0
  let totalLiquido = 0

  const exportarComissao = () => {
    if (parceiro) {
      console.log('exportar')
    }
  }

  //componenteInit
  useEffect(() => {
    if (token) {
      UsuarioService.get(token)
        .then(usuario => {
          setParceiro(usuario)
          FinanceiroService.getComissaoParceiros(token, ano, mes)
            .then(respComissaoList => {
              console.log(respComissaoList)
              setComissaoList(respComissaoList)
            })
            .catch(err => {
              toast.error(trataErro(err))
            })
            .finally(() => {})
        })
        .catch(err => {
          toast.error(trataErro(err))
        })
        .finally(() => {})
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    //console.log('caregando parceiros')

    UsuarioService.getListParceirosSelect()
      .then(respUsuario => {
        //respUsuario.push({ id: 0, nome: 'Todos os parceiros', token: 'todos' } as UsuarioType)
        setListParceiros(respUsuario)

        //console.log('respUsuario', respUsuario)
      })
      .catch(err => {
        toast.error(trataErro(err))
      })
      .finally(() => {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    token && (
      <>
        <Card sx={{ mb: 2.5 }}>
          <CardHeader
            title={
              <>
                <span>
                  Extrato de comissão: {parceiro?.nome} -{' '}
                  {moment({ year: ano, month: mes - 1, day: 1 })
                    .format('MMMM/YYYY')
                    .toUpperCase()}{' '}
                  <br />
                  Data do crédito: {dataCreditoEquipe}
                </span>
              </>
            }
            className='gap-2 flex-col items-start sm:flex-row sm:items-center'
            sx={{ '& .MuiCardHeader-action': { m: 0 }, '& .MuiInputBase-root': { mr: 3 } }}
            action={
              <>
                <CustomTextField
                  select
                  value={comissaoFilter.token || 'todos'}
                  onChange={e => setComissaoFilter({ ...comissaoFilter, token: e.target.value })}
                >
                  {listParceiros.map((parceiro, index) => (
                    <MenuItem key={index} value={parceiro.token} selected={parceiro.token === comissaoFilter.token}>
                      {parceiro.nome}
                    </MenuItem>
                  ))}
                </CustomTextField>
                <CustomTextField
                  select
                  value={comissaoFilter.mes || 'todos'}
                  onChange={e => setComissaoFilter({ ...comissaoFilter, mes: e.target.value })}
                >
                  <MenuItem value='todos' selected={'todos' == comissaoFilter.mes}>
                    Todos os meses
                  </MenuItem>
                  <MenuItem value='01' selected={'01' == comissaoFilter.mes}>
                    Janeiro
                  </MenuItem>
                  <MenuItem value='02' selected={'02' == comissaoFilter.mes}>
                    Fevereiro
                  </MenuItem>
                  <MenuItem value='03' selected={'03' == comissaoFilter.mes}>
                    Março
                  </MenuItem>
                  <MenuItem value='04' selected={'04' == comissaoFilter.mes}>
                    Abril
                  </MenuItem>
                  <MenuItem value='05' selected={'05' == comissaoFilter.mes}>
                    Maio
                  </MenuItem>
                  <MenuItem value='06' selected={'06' == comissaoFilter.mes}>
                    Junho
                  </MenuItem>
                  <MenuItem value='07' selected={'07' == comissaoFilter.mes}>
                    Julho
                  </MenuItem>
                  <MenuItem value='08' selected={'08' == comissaoFilter.mes}>
                    Agosto
                  </MenuItem>
                  <MenuItem value='09' selected={'09' == comissaoFilter.mes}>
                    Setembro
                  </MenuItem>
                  <MenuItem value='10' selected={'10' == comissaoFilter.mes}>
                    Outubro
                  </MenuItem>
                  <MenuItem value='11' selected={'11' == comissaoFilter.mes}>
                    Novembro
                  </MenuItem>
                  <MenuItem value='12' selected={'12' == comissaoFilter.mes}>
                    Dezembro
                  </MenuItem>
                </CustomTextField>

                <CustomTextField
                  select
                  value={comissaoFilter.ano || 'todos'}
                  onChange={e => setComissaoFilter({ ...comissaoFilter, ano: e.target.value })}
                >
                  <MenuItem value='todos' selected={'todos' == comissaoFilter.mes}>
                    Todos os anos
                  </MenuItem>
                  <MenuItem value='2028' selected={'2028' == comissaoFilter.ano}>
                    2028
                  </MenuItem>
                  <MenuItem value='2027' selected={'2027' == comissaoFilter.ano}>
                    2027
                  </MenuItem>
                  <MenuItem value='2026' selected={'2026' == comissaoFilter.ano}>
                    2026
                  </MenuItem>
                  <MenuItem value='2025' selected={'2025' == comissaoFilter.ano}>
                    2025
                  </MenuItem>
                  <MenuItem value='2024' selected={'2024' == comissaoFilter.ano}>
                    2024
                  </MenuItem>
                  <MenuItem value='2023' selected={'2023' == comissaoFilter.ano}>
                    2023
                  </MenuItem>
                </CustomTextField>

                <Button
                  variant='contained'
                  href={`/financeiro/comissao/parceiros/${comissaoFilter.token}/extrato/${comissaoFilter.ano}/${comissaoFilter.mes}`}
                >
                  Carregar extrato
                </Button>
              </>
            }
          />
        </Card>

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label='extrato contrato'>
            <TableHead>
              <TableRow>
                <TableCell align='center'></TableCell>
                <TableCell align='center'>Cliente</TableCell>
                <TableCell align='center'>Valor</TableCell>
                <TableCell align='center'>Tipo</TableCell>
                <TableCell align='center'>Data Entrada</TableCell>
                <TableCell align='center'>Data Crédito</TableCell>
                <TableCell align='center'>%</TableCell>
                <TableCell align='center'>Dias Pró-Rata</TableCell>
                <TableCell align='center'>Valor Total</TableCell>
                <TableCell align='center'>% IR</TableCell>
                <TableCell align='center'>Valor IR</TableCell>
                <TableCell align='center'>Valor Líquido</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {comissaoList.map(comissao => {
                if (!dataCreditoEquipe)
                  setDataCreditoEquipe(
                    comissao.dataCreditoEquipe ? moment(comissao.dataCreditoEquipe).format('DD-MM-YYYY') : ''
                  )
                countItens++
                totalAporte += comissao?.valorReferencia ? comissao?.valorReferencia : 0
                totalBruto += comissao?.valorGestor ? comissao?.valorGestor : 0
                totalIR += comissao?.valorIRGestor ? comissao?.valorIRGestor : 0

                const valorLiquido =
                  comissao.valorGestor && comissao.valorIRGestor ? comissao.valorGestor - comissao.valorIRGestor : 0

                totalLiquido += valorLiquido

                return (
                  <StyledTableRow key={comissao.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell align='center'>{countItens}</TableCell>
                    <TableCell align='center'>{comissao.cliente?.nome}</TableCell>
                    <TableCell align='center'>
                      {comissao.valorReferencia ? valorBr.format(comissao?.valorReferencia) : ''}
                    </TableCell>
                    <TableCell align='center'>
                      <Chip
                        size='small'
                        label={comissao.tipoExtrato ? getTipoExtratoEnumDesc(comissao.tipoExtrato) : ''}
                        color={comissao.tipoExtrato ? getTipoExtratoEnumColor(comissao.tipoExtrato) : 'default'}
                        sx={{ fontSize: '12px', height: '20px' }}
                      />
                    </TableCell>
                    <TableCell align='center'>
                      {comissao.extrato?.data ? moment(comissao.extrato?.data).format('DD-MM-YYYY') : ''}
                    </TableCell>
                    <TableCell align='center'>
                      {comissao.dataCreditoCliente ? moment(comissao.dataCreditoCliente).format('DD') : ''}
                    </TableCell>
                    <TableCell align='center'>{comissao.taxaGestor}%</TableCell>
                    <TableCell align='center'>
                      {comissao.diasProrataEquipe && comissao.diasProrataEquipe > 0 ? comissao.diasProrataEquipe : '-'}
                    </TableCell>
                    <TableCell align='center'>
                      {comissao.valorGestor ? valorBr.format(comissao.valorGestor) : ''}
                    </TableCell>
                    <TableCell align='center'>{comissao.IRGestor}%</TableCell>
                    <TableCell align='center'>
                      {comissao.valorIRGestor ? valorBr.format(comissao.valorIRGestor) : ''}
                    </TableCell>
                    <TableCell align='center'>{valorBr.format(valorLiquido)}</TableCell>
                  </StyledTableRow>
                )
              })}
            </TableBody>
            <TableHead>
              <TableRow>
                <TableCell align='center' colSpan={2}>
                  Carteira
                </TableCell>
                <TableCell align='center'>{valorBr.format(totalAporte)}</TableCell>
                <TableCell align='center' colSpan={5}>
                  Comissionamento refernte a{' '}
                  {moment({ year: ano, month: mes - 2, day: 1 })
                    .format('MMMM/YYYY')
                    .toUpperCase()}
                </TableCell>
                <TableCell align='center'>{valorBr.format(totalBruto)}</TableCell>
                <TableCell align='center'></TableCell>
                <TableCell align='center'>{valorBr.format(totalIR)}</TableCell>
                <TableCell align='center'>{valorBr.format(totalLiquido)}</TableCell>
              </TableRow>
            </TableHead>
            <caption>
              <Button
                variant='contained'
                startIcon={<i className='tabler-arrow-back-up' />}
                onClick={() => window.history.back()}
                sx={{ float: 'left' }}
              >
                Voltar para a listagem
              </Button>
              <Button
                variant='contained'
                startIcon={<i className='tabler-download' />}
                onClick={() => exportarComissao()}
                sx={{ float: 'right' }}
              >
                Exportar
              </Button>
            </caption>
          </Table>
        </TableContainer>
      </>
    )
  )
}
