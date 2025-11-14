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

import { valorBr } from '@/utils/string'
import { trataErro } from '@/utils/erro'
import FinanceiroService from '@/services/FinanceiroService'
import UsuarioService from '@/services/UsuarioService'
import type { UsuarioType } from '@/types/UsuarioType'
import { getTipoExtratoEnumColor, getTipoExtratoEnumDesc } from '@/utils/enums/TipoExtratoEnum'
import CustomTextField from '@/@core/components/mui/TextField'
import type ComissaoExtratoType from '@/types/ComissaoExtratoType'

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
  token: string | undefined
  ano: string | undefined
  mes: string | undefined
}

export default function ExtratoComissaoAgente({ token, ano, mes }: props) {
  //const [saldo, setSaldo] = useState<number>(0)
  const [agente, setAgente] = useState<UsuarioType>()
  const [comissaoList, setComissaoList] = useState<ComissaoExtratoType[]>([])
  const [dataCreditoEquipe, setDataCreditoEquipe] = useState<string>()
  const [listAgentes, setListAgentes] = useState<UsuarioType[]>([])

  const [comissaoFilter, setComissaoFilter] = useState({
    token: token || 'all',
    mes: mes || moment().add(1, 'month').month().toString(),
    ano: ano || moment().year().toString(),
    primeiroAno: 2024,
    ultimoAno: moment().add(3, 'year').year()
  })

  let countItens = 0
  let totalAporte = 0
  let totalBruto = 0
  let totalIR = 0
  let totalLiquido = 0

  const exportarComissao = () => {
    if (!comissaoList || comissaoList.length === 0) {
      toast.info('Nenhum registro para exportar.')

      return
    }

    // Cabeçalhos da planilha
    // Linha de totais
    const linhaCabecalho = `<thead><tr><th colspan="12">Extrato de comissão: ${agente?.nome} - ${moment({
      year: Number(ano),
      month: Number(mes),
      day: 1
    })
      .subtract(1, 'month')
      .format('MMMM/YYYY')
      .toUpperCase()} - Data do crédito: ${dataCreditoEquipe}</th></tr></thead>`

    const headers = [
      '#',
      'Cliente',
      'Valor',
      'Tipo',
      'Data Entrada',
      'Data Crédito',
      '%',
      'Dias Pró-Rata',
      'Valor Total',
      '% IR',
      'Valor IR',
      'Valor Líquido'
    ]

    // Linhas dos registros
    const rows: string[] = []
    let count = 0
    let totalAporte = 0
    let totalBruto = 0
    let totalIR = 0
    let totalLiquido = 0

    comissaoList.forEach(c => {
      count++
      const cliente = c.cliente?.nome || ''
      const valorDeposito = c.valorDeposito ? valorBr.format(c.valorDeposito) : ''
      const tipo = c.tipoDeposito ? getTipoExtratoEnumDesc(c.tipoDeposito) : ''
      const dataEntrada = c.dataDeposito ? moment(c.dataDeposito).format('DD-MM-YYYY') : ''
      const dataCredito = c.dataCreditoCliente ? moment(c.dataCreditoCliente).format('DD-MM-YYYY') : ''
      const taxa = c.taxa != null ? `${c.taxa}%` : ''
      const dias = c.diasProrata && c.diasProrata > 0 ? String(c.diasProrata) : '-'
      const valorBruto = c.valorBruto ? valorBr.format(c.valorBruto) : ''
      const irPercent = c.IR != null ? `${c.IR}%` : ''
      const valorIR = c.valorIR ? valorBr.format(c.valorIR) : ''
      const valorLiquidoNum = c.valorBruto && c.valorIR ? c.valorBruto - c.valorIR : 0
      const valorLiquido = valorBr.format(valorLiquidoNum)

      totalAporte += c.valorDeposito || 0
      totalBruto += c.valorBruto || 0
      totalIR += c.valorIR || 0
      totalLiquido += valorLiquidoNum

      const cols = [
        String(count),
        cliente,
        valorDeposito,
        tipo,
        dataEntrada,
        dataCredito,
        taxa,
        dias,
        valorBruto,
        irPercent,
        valorIR,
        valorLiquido
      ]

      // montar linha CSV/HTML (usando célula entre <td>)
      rows.push('<tr>' + cols.map(v => `<td>${v}</td>`).join('') + '</tr>')
    })

    // Linha de totais
    const totalsRow =
      '<tr>' +
      `<td colspan="2">Carteira</td>` +
      `<td>${valorBr.format(totalAporte)}</td>` +
      `<td colspan="5">Comissionamento referente a ${moment({ year: Number(ano), month: Number(mes), day: 1 })
        .subtract(2, 'month')
        .format('MMMM/YYYY')
        .toUpperCase()}</td>` +
      `<td>${valorBr.format(totalBruto)}</td>` +
      `<td></td>` +
      `<td>${valorBr.format(totalIR)}</td>` +
      `<td>${valorBr.format(totalLiquido)}</td>` +
      '</tr>'

    // Monta tabela HTML (compatível com Excel)
    const html =
      `<table border=1>${linhaCabecalho}<thead><tr>` +
      headers.map(h => `<th>${h}</th>`).join('') +
      `</tr></thead><tbody>` +
      rows.join('') +
      `</tbody><tfoot>${totalsRow}</tfoot></table>`

    // Gera e baixa o arquivo .xls
    try {
      const blob = new Blob(['\ufeff', html], { type: 'application/vnd.ms-excel;charset=utf-8;' })

      const fileName = `extrato_comissao_paceiro_${agente?.nome?.replace(/\s+/g, '_') || 'agente'}_${ano || ''}_${
        mes || ''
      }.xls`

      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')

      a.href = url
      a.download = fileName
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
      toast.success('Exportação concluída.')
    } catch (err) {
      toast.error('Erro ao gerar arquivo.')
    }
  }

  //componenteInit
  useEffect(() => {
    if (token) {
      UsuarioService.get(token)
        .then(usuario => {
          setAgente(usuario)
          FinanceiroService.getComissaoAgentes(
            comissaoFilter.token != 'all' ? comissaoFilter.token : undefined,
            comissaoFilter.ano != 'all' ? comissaoFilter.ano : undefined,
            comissaoFilter.mes != 'all' ? comissaoFilter.mes : undefined
          )
            .then(respComissaoList => {
              console.log(respComissaoList)
              setComissaoList(respComissaoList.listComissoesExtrato)
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
    //console.log('caregando agentes')

    UsuarioService.getListAgentesSelect()
      .then(respUsuario => {
        if (!comissaoFilter.token || comissaoFilter.token == 'all')
          respUsuario.unshift({ id: 0, nome: 'Selecione um assessor', token: 'all' } as UsuarioType)
        setListAgentes(respUsuario)

        //console.log('respUsuario', respUsuario)
      })
      .catch(err => {
        toast.error(trataErro(err))
      })
      .finally(() => {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <Card sx={{ mb: 2.5 }}>
        <CardHeader
          title='Extrato de comissão de Assessores'
          className='gap-2 flex-col items-start sm:flex-row sm:items-center'
          sx={{ '& .MuiCardHeader-action': { m: 0 }, '& .MuiInputBase-root': { mr: 3 } }}
          action={
            <>
              <CustomTextField
                select
                value={comissaoFilter.token || 'all'}
                onChange={e => setComissaoFilter({ ...comissaoFilter, token: e.target.value })}
              >
                {listAgentes.map((agente, index) => (
                  <MenuItem key={index} value={agente.token} selected={agente.token === comissaoFilter.token}>
                    {agente.nome}
                  </MenuItem>
                ))}
              </CustomTextField>
              <CustomTextField
                select
                value={comissaoFilter.mes || 'all'}
                onChange={e => setComissaoFilter({ ...comissaoFilter, mes: e.target.value })}
              >
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
                value={comissaoFilter.ano || 'all'}
                onChange={e => setComissaoFilter({ ...comissaoFilter, ano: e.target.value })}
              >
                {Array.from(
                  { length: comissaoFilter.ultimoAno - comissaoFilter.primeiroAno + 1 },
                  (_, i) => comissaoFilter.ultimoAno - i
                ).map(year => (
                  <MenuItem key={year} value={String(year)} selected={String(year) === comissaoFilter.ano}>
                    {year}
                  </MenuItem>
                ))}
              </CustomTextField>

              <Button
                variant='contained'
                href={`/financeiro/comissao/mensal/assessores/extrato/${comissaoFilter.token}/${comissaoFilter.ano}/${comissaoFilter.mes}`}
                onClick={e => {
                  if (
                    comissaoFilter.token == 'all' ||
                    (comissaoFilter.ano != 'all' && comissaoFilter.mes == 'all') ||
                    (comissaoFilter.ano == 'all' && comissaoFilter.mes != 'all')
                  ) {
                    e.preventDefault()
                    alert('Favor informar um assessor o mes e ano')
                  }

                  return false
                }}
              >
                Carregar extrato
              </Button>
            </>
          }
        />
        <div className='container flex justify-between  border-bs '>
          <div className='p-6 gap-4'>{agente?.nome}</div>
          <div className='text-center p-6 gap-4'>
            {moment({ year: Number(comissaoFilter.ano), month: Number(comissaoFilter.mes), day: 1 })
              .subtract(1, 'month')
              .format('MMMM/YYYY')
              .toUpperCase()}{' '}
            <br />
            {dataCreditoEquipe ? `Data do crédito: ${dataCreditoEquipe}` : ''}
          </div>
        </div>
      </Card>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label='extrato contrato'>
          {token && (
            <>
              <TableHead>
                <TableRow>
                  <TableCell align='center'></TableCell>
                  <TableCell align='center'>Cliente</TableCell>
                  <TableCell align='center'>Valor Depósito</TableCell>
                  <TableCell align='center'>Tipo</TableCell>
                  <TableCell align='center'>Data Entrada</TableCell>
                  <TableCell align='center'>Data Crédito</TableCell>
                  <TableCell align='center'>%</TableCell>
                  <TableCell align='center'>Dias Pró-Rata</TableCell>
                  <TableCell align='center'>Valor Total</TableCell>
                  <TableCell align='center'>% IR</TableCell>
                  <TableCell align='center'>Valor IR</TableCell>
                  <TableCell align='center'>Valor Repasse</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {comissaoList?.map(comissao => {
                  if (!dataCreditoEquipe)
                    setDataCreditoEquipe(
                      comissao.dataCreditoGestor ? moment(comissao.dataCreditoGestor).format('DD-MM-YYYY') : ''
                    )
                  countItens++
                  totalAporte += comissao?.valorDeposito ? comissao?.valorDeposito : 0
                  totalBruto +=
                    comissao?.taxa && comissao?.valorDeposito && comissao?.diasProrata && comissao.diasProrata > 0
                      ? (comissao?.valorDeposito * comissao?.taxa) / 100
                      : comissao?.valorBruto
                        ? comissao?.valorBruto
                        : 0
                  totalIR += comissao?.valorIR ? comissao?.valorIR : 0

                  const valorLiquido = comissao.valorLiquido

                  totalLiquido += valorLiquido || 0

                  return (
                    <StyledTableRow key={comissao.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell align='center'>{countItens}</TableCell>
                      <TableCell align='center'>{comissao.cliente?.nome}</TableCell>
                      <TableCell align='center'>
                        {comissao.valorDeposito ? valorBr.format(comissao?.valorDeposito) : ''}
                      </TableCell>
                      <TableCell align='center'>
                        <Chip
                          size='small'
                          label={comissao.tipoDeposito ? getTipoExtratoEnumDesc(comissao.tipoDeposito) : ''}
                          color={comissao.tipoDeposito ? getTipoExtratoEnumColor(comissao.tipoDeposito) : 'default'}
                          sx={{ fontSize: '12px', height: '20px' }}
                        />
                      </TableCell>
                      <TableCell align='center'>
                        {comissao.dataDeposito ? moment(comissao.dataDeposito).format('DD-MM-YYYY') : ''}
                      </TableCell>
                      <TableCell align='center'>
                        {comissao.dataCreditoCliente ? moment(comissao.dataCreditoCliente).format('DD/MM') : ''}
                      </TableCell>
                      <TableCell align='center'>{comissao.taxa}%</TableCell>
                      <TableCell align='center'>
                        {comissao.diasProrata && comissao.diasProrata > 0 ? comissao.diasProrata : '-'}
                      </TableCell>
                      <TableCell align='center'>
                        {comissao?.valorDeposito && comissao?.taxa
                          ? valorBr.format((comissao?.valorDeposito * comissao?.taxa) / 100)
                          : ''}
                      </TableCell>
                      <TableCell align='center'>{comissao.IR}%</TableCell>
                      <TableCell align='center'>{comissao.valorIR ? valorBr.format(comissao.valorIR) : ''}</TableCell>
                      <TableCell align='center'>{valorBr.format(valorLiquido || 0)}</TableCell>
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
                    Comissionamento referente a{' '}
                    {moment({ year: Number(ano), month: Number(mes), day: 1 })
                      .subtract(2, 'month')
                      .format('MMMM/YYYY')
                      .toUpperCase()}
                  </TableCell>
                  <TableCell align='center'>{valorBr.format(totalBruto)}</TableCell>
                  <TableCell align='center'></TableCell>
                  <TableCell align='center'>{valorBr.format(totalIR)}</TableCell>
                  <TableCell align='center'>{valorBr.format(totalLiquido)}</TableCell>
                </TableRow>
              </TableHead>
            </>
          )}
          <caption>
            <Button
              href={`/financeiro/comissao/mensal/assessores/`}
              variant='contained'
              startIcon={<i className='tabler-arrow-back-up' />}
              sx={{ float: 'left' }}

              //onClick={() => window.history.back()}
            >
              Voltar para a listagem mensal
            </Button>
            {token && (
              <Button
                variant='contained'
                startIcon={<i className='tabler-download' />}
                onClick={() => exportarComissao()}
                sx={{ float: 'right' }}
              >
                Exportar
              </Button>
            )}
          </caption>
        </Table>
      </TableContainer>
    </>
  )
}
