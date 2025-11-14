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
  token: string | undefined
  ano: string | undefined
  mes: string | undefined
}

export default function ExtratoComissaoInvestidor({ token, ano, mes }: props) {
  //const [saldo, setSaldo] = useState<number>(0)
  const [cliente, setCliente] = useState<UsuarioType>()
  const [comissaoList, setComissaoList] = useState<ComissaoType[]>([])
  const [dataCreditoCliente, setDataCreditoCliente] = useState<string>()

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
    const linhaCabecalho = `<thead><tr><th colspan="12">Extrato de comissão: ${cliente?.nome} - ${moment({
      year: Number(ano),
      month: Number(mes),
      day: 1
    })
      .subtract(1, 'month')
      .format('MMMM/YYYY')
      .toUpperCase()} - Data do crédito: ${dataCreditoCliente}</th></tr></thead>`

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
      const valorExtrato = c.valorExtrato ? valorBr.format(c.valorExtrato) : ''
      const tipo = c.tipoExtrato ? getTipoExtratoEnumDesc(c.tipoExtrato) : ''
      const dataEntrada = c.extrato?.data ? moment(c.extrato.data).format('DD-MM-YYYY') : ''
      const dataCredito = c.dataCreditoCliente ? moment(c.dataCreditoCliente).format('DD-MM-YYYY') : ''
      const taxa = c.taxaCliente != null ? `${c.taxaCliente}%` : ''
      const dias = c.diasProrataCliente && c.diasProrataCliente > 0 ? String(c.diasProrataCliente) : '-'
      const valorCliente = c.valorCliente ? valorBr.format(c.valorCliente) : ''
      const irPercent = c.IRCliente != null ? `${c.IRCliente}%` : ''
      const valorIR = c.valorIRCliente ? valorBr.format(c.valorIRCliente) : ''
      const valorLiquidoNum = c.valorCliente && c.valorIRCliente ? c.valorCliente - c.valorIRCliente : 0
      const valorLiquido = valorBr.format(valorLiquidoNum)

      totalAporte += c.valorExtrato || 0
      totalBruto += c.valorCliente || 0
      totalIR += c.valorIRCliente || 0
      totalLiquido += valorLiquidoNum

      const cols = [
        String(count),
        cliente,
        valorExtrato,
        tipo,
        dataEntrada,
        dataCredito,
        taxa,
        dias,
        valorCliente,
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

      const fileName = `extrato_comissao_${cliente?.nome?.replace(/\s+/g, '_') || 'parceiro'}_${ano || ''}_${
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
          setCliente(usuario)
          FinanceiroService.getComissaoInvestidores(comissaoFilter.token, comissaoFilter.ano, comissaoFilter.mes)
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

  return (
    <>
      <Card sx={{ mb: 2.5 }}>
        <CardHeader
          title={
            <>
              <span>
                Extrato de comissão: {cliente?.nome}
                <br />
                Referência:{' '}
                {moment({ year: Number(ano), month: Number(mes), day: 1 })
                  .subtract(1, 'month')
                  .format('MMMM/YYYY')
                  .toUpperCase()}
                {' - '}
                Data do crédito: {dataCreditoCliente}
              </span>
            </>
          }
          className='gap-2 flex-col items-start sm:flex-row sm:items-center'
          sx={{ '& .MuiCardHeader-action': { m: 0 }, '& .MuiInputBase-root': { mr: 3 } }}
          action={
            <>
              <CustomTextField
                select
                value={comissaoFilter.mes || 'todos'}
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
                value={comissaoFilter.ano || 'todos'}
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
                href={`/financeiro/comissao/investidores/extrato/${comissaoFilter.token}/${comissaoFilter.ano}/${comissaoFilter.mes}`}
                onClick={e => {
                  if (
                    comissaoFilter.token == 'todos' ||
                    (comissaoFilter.ano != 'todos' && comissaoFilter.mes == 'todos') ||
                    (comissaoFilter.ano == 'todos' && comissaoFilter.mes != 'todos')
                  ) {
                    e.preventDefault()
                    alert('Favor informar um cliente, o mes e ano')
                  }

                  return false
                }}
              >
                Carregar extrato
              </Button>
            </>
          }
        />
      </Card>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label='extrato contrato'>
          {token && (
            <>
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
                  if (!cliente) setCliente(comissao.cliente)
                  if (!dataCreditoCliente)
                    setDataCreditoCliente(
                      comissao.dataCreditoCliente ? moment(comissao.dataCreditoCliente).format('DD-MM-YYYY') : ''
                    )
                  countItens++
                  totalAporte += comissao?.valorExtrato ? comissao?.valorExtrato : 0
                  totalBruto += comissao?.valorCliente ? comissao?.valorCliente : 0
                  totalIR += comissao?.valorIRCliente ? comissao?.valorIRCliente : 0

                  const valorLiquido =
                    comissao.valorCliente && comissao.valorIRCliente
                      ? comissao.valorCliente - comissao.valorIRCliente
                      : 0

                  totalLiquido += valorLiquido

                  return (
                    <StyledTableRow key={comissao.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell align='center'>{countItens}</TableCell>
                      <TableCell align='center'>{comissao.cliente?.nome}</TableCell>
                      <TableCell align='center'>
                        {comissao.valorExtrato ? valorBr.format(comissao?.valorExtrato) : ''}
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
                        {comissao.diasProrataCliente && comissao.diasProrataCliente > 0
                          ? comissao.diasProrataCliente
                          : '-'}
                      </TableCell>
                      <TableCell align='center'>
                        {comissao.valorCliente ? valorBr.format(comissao.valorCliente) : ''}
                      </TableCell>
                      <TableCell align='center'>{comissao.IRGestor}%</TableCell>
                      <TableCell align='center'>
                        {comissao.valorIRCliente ? valorBr.format(comissao.valorIRCliente) : ''}
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
              variant='contained'
              startIcon={<i className='tabler-arrow-back-up' />}
              onClick={() => window.history.back()}
              sx={{ float: 'left' }}
            >
              Voltar para a listagem
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
