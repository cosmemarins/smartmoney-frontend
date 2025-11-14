'use client'

// React Imports
import { useEffect, useMemo, useState } from 'react'

// Type Imports
import { useSession } from 'next-auth/react'

import {
  Button,
  Card,
  CardHeader,
  Grid,
  IconButton,
  Link,
  MenuItem,
  Paper,
  styled,
  TableContainer,
  TablePagination,
  Typography
} from '@mui/material'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'

import type { ColumnDef, FilterFn, Row } from '@tanstack/react-table'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getPaginationRowModel,
  getSortedRowModel,
  getExpandedRowModel
} from '@tanstack/react-table'

import classnames from 'classnames'

import { rankItem } from '@tanstack/match-sorter-utils'

import { toast } from 'react-toastify'

import moment, { locale } from 'moment'
import 'moment/locale/pt-br'

import CustomTextField from '@/@core/components/mui/TextField'
import type { ComissaoType, ComissaoTypeAction } from '@/types/ComissaoType'

// Style Imports
import tableStyles from '@core/styles/table.module.css'
import TablePaginationComponent from '@/components/TablePaginationComponent'
import { valorBr, valorEmReal } from '@/utils/string'
import FinanceiroService from '@/services/FinanceiroService'
import { PerfilUsuarioEnum } from '@/utils/enums/PerfilUsuarioEnum'

import type { TotaisComissaoType } from '@/types/TotaisComissaoType'

import UsuarioService from '@/services/UsuarioService'
import type { UsuarioType } from '@/types/UsuarioType'
import { trataErro } from '@/utils/erro'

locale('pt-br')

// Column Definitions
const columnHelper = createColumnHelper<ComissaoTypeAction>()

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value)

  // Store the itemRank info
  addMeta({
    itemRank
  })

  // Return if the item should be filtered in/out
  return itemRank.passed
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    color: theme.palette.common.black,
    fontSize: 12,
    fontWeight: 700
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 12
  }
}))

const renderSubComponent = ({ row }: { row: Row<ComissaoType> }) => {
  return (
    <>
      <Grid container spacing={0} direction='column' alignItems='end' justifyContent='center'>
        <TableContainer sx={{ width: 700 }} component={Paper}>
          <Table size='small' aria-label='Prorata'>
            <TableHead>
              <StyledTableCell sx={{ textAlign: 'center' }}>Data Aditivo</StyledTableCell>
              <StyledTableCell align='center'>Dias Mês</StyledTableCell>
              <StyledTableCell align='center'>Dias Prorata</StyledTableCell>
              <StyledTableCell align='center'>Valor</StyledTableCell>
              <StyledTableCell align='center'>Taxa</StyledTableCell>
              <StyledTableCell align='center'>Valor Repasse</StyledTableCell>
            </TableHead>
            <TableBody>
              {row.original.proratas?.map((prorata, index) => (
                <TableRow key={index}>
                  <StyledTableCell align='center' scope='row'>
                    {moment(prorata?.dataAditivo).utcOffset('+0300').format('DD/MM/YYYY')}
                  </StyledTableCell>
                  <StyledTableCell align='center' scope='row'>
                    {prorata.diasNoMes}
                  </StyledTableCell>
                  <StyledTableCell align='center' scope='row'>
                    {prorata.diasProrata}
                  </StyledTableCell>
                  <StyledTableCell align='center' scope='row'>
                    {valorEmReal.format(prorata.valor || 0)}
                  </StyledTableCell>
                  <StyledTableCell align='center' scope='row'>
                    {valorBr.format(prorata.taxa || 0)}%
                  </StyledTableCell>
                  <StyledTableCell align='center'>{valorEmReal.format(prorata.valorRepasse || 0)}</StyledTableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </>
  )
}

interface Props {
  token: string | undefined
  ano: string | undefined
  mes: string | undefined
}

const ComissaoParceirosListTable = ({ token, ano, mes }: Props) => {
  // Hooks
  const { data: session } = useSession()

  // States
  const [rowSelection, setRowSelection] = useState({})
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [data, setData] = useState<ComissaoType[]>([])
  const [listParceiros, setListParceiros] = useState<UsuarioType[]>([])

  const [comissaoFilter, setComissaoFilter] = useState({
    token: token || 'all',
    mes: mes || 'all',
    ano: ano || 'all',
    primeiroAno: 2024,
    ultimoAno: moment().add(3, 'year').year()
  })

  const [totais, setTotais] = useState<TotaisComissaoType>()
  const [globalFilter, setGlobalFilter] = useState('')
  const [refreshTable, setRefreshTable] = useState<boolean>(true)

  const columns = useMemo<ColumnDef<ComissaoTypeAction, any>[]>(
    () => [
      columnHelper.accessor('nomeCliente', {
        header: 'Cliente',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <div className='flex flex-col'>
              <Typography color='text.primary' className='font-medium'>
                {row.original.nomeCliente}
              </Typography>
              <Typography variant='body2'>Gestor: {row.original.nomeGestor || row.original.nomeMaster}</Typography>
              {session?.user.perfil != PerfilUsuarioEnum.AGENTE && row.original.parceiro1 && (
                <Typography variant='body2'>
                  Parceiro: {row.original.nomeParceiro1}
                  {row.original.parceiro2 && row.original.parceiro2 && ` -> ${row.original.nomeParceiro2}`}
                  {row.original.parceiro3 && row.original.parceiro3 && ` -> ${row.original.nomeParceiro3}`}
                </Typography>
              )}
            </div>
          </div>
        )
      }),
      columnHelper.accessor('dataAporte', {
        header: 'Data Aporte',
        cell: ({ row }) => (
          <Typography color='text.primary'>
            {moment(row.original.dataAporte).utcOffset('+0300').format('DD/MM/YYYY')}
          </Typography>
        )
      }),
      columnHelper.accessor('dataCredito', {
        header: 'Data Crédito',
        cell: ({ row }) => (
          <Typography color='text.primary'>
            {moment(row.original.dataCredito).utcOffset('+0300').format('DD/MM/YYYY')}
          </Typography>
        )
      }),
      columnHelper.accessor('dataVencimento', {
        header: 'Data Vencimento',
        cell: ({ row }) => (
          <Typography color='text.primary'>
            {moment(row.original.dataVencimento).utcOffset('+0300').format('DD/MM/YYYY')}
          </Typography>
        )
      }),
      columnHelper.accessor('saldo', {
        header: 'Saldo',
        cell: ({ row }) => (
          <>
            <div className='text-center'>
              <Typography color='text.primary'>{valorBr.format(row.original.saldo || 0)}</Typography>
              {row.original.proratas && row.original.proratas.length > 0 && (
                <small>
                  saldo: {valorBr.format(row.original.valor || 0)}
                  <br />
                  prorata:{' '}
                  {valorBr.format(
                    row.original.proratas.reduce(function (total, item) {
                      return total + (item?.valor || 0)
                    }, 0)
                  )}
                </small>
              )}

              {row.getCanExpand() && (
                <IconButton size='small' onClick={() => row.toggleExpanded()}>
                  {row.getIsExpanded() ? (
                    <i className='tabler-arrow-big-up-filled' />
                  ) : (
                    <i className='tabler-arrow-big-down-filled' />
                  )}
                </IconButton>
              )}
            </div>
          </>
        )
      }),
      columnHelper.accessor('taxa', {
        header: 'Taxa',
        cell: ({ row }) => <Typography color='text.primary'>{valorBr.format(row.original.taxa || 0)}%</Typography>
      }),
      columnHelper.accessor('valorRepasse', {
        header: 'Valor Repasse',
        cell: ({ row }) => (
          <>
            <div className='text-center'>
              <Typography color='text.primary'>{valorBr.format(row.original.valorRepasseGestor || 0)}</Typography>
              {row.original.proratas && row.original.proratas.length > 0 && (
                <small>
                  saldo: {valorBr.format(row.original.valorRepasseGestor || 0)}
                  <br />
                  prorata:{' '}
                  {valorBr.format(
                    row.original.proratas.reduce(function (total, item) {
                      return total + (item?.valorRepasseGestor || 0)
                    }, 0)
                  )}
                </small>
              )}
            </div>
          </>
        )
      }),
      columnHelper.accessor('contrato', {
        header: '',
        cell: ({ row }) => (
          <div className='text-center'>
            <IconButton>
              <Link
                href={`/financeiro/comissao/mensal/investidores/extrato/${row.original.token}/${comissaoFilter.ano != 'all' && comissaoFilter.mes != 'all' ? comissaoFilter.ano + '/' + comissaoFilter.mes : ''}`}
                title='Extrato'
              >
                <i className='tabler-file-description text-[22px] text-textSecondary' />
              </Link>
            </IconButton>
          </div>
        )
      })
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const table = useReactTable({
    data: data as ComissaoType[],
    columns,
    filterFns: {
      fuzzy: fuzzyFilter
    },
    state: {
      rowSelection,
      globalFilter
    },
    initialState: {
      pagination: {
        pageSize: 10
      }
    },
    enableRowSelection: true, //enable row selection for all rows
    // enableRowSelection: row => row.original.age > 18, // or enable row selection conditionally per row
    globalFilterFn: fuzzyFilter,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    getExpandedRowModel: getExpandedRowModel(),
    getRowCanExpand: row => {
      return row.original.proratas.length > 0 ? true : false
    }
  })

  useEffect(() => {
    if (refreshTable) {
      setRefreshTable(false)
      FinanceiroService.getListComissaoMensalGestor(
        comissaoFilter.token != 'all' ? comissaoFilter.token : undefined,
        comissaoFilter.ano != 'all' ? comissaoFilter.ano : undefined,
        comissaoFilter.mes != 'all' ? comissaoFilter.mes : undefined
      )
        .then(respComissaoView => {
          console.log('respListComissao', respComissaoView)
          setData(respComissaoView.listComissao)
          setTotais(respComissaoView.totaisComissao)
        })
        .catch(err => {
          toast.error(trataErro(err))
        })
        .finally(() => {})
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshTable])

  useEffect(() => {
    //console.log('caregando parceiros')

    UsuarioService.getListParceirosSelect()
      .then(respUsuario => {
        respUsuario.unshift({ id: 0, nome: 'Todos os parceiros', token: 'all' } as UsuarioType)
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
    <>
      <Card>
        <CardHeader
          title='Minhas Comissisões - Resumo Mensal'
          className='pbe-4'
          action={
            <Button
              href={
                `/financeiro/comissao/gestor/extrato/` +
                (comissaoFilter.token != 'all' && comissaoFilter.ano != 'all' && comissaoFilter.mes != 'all'
                  ? `${comissaoFilter.token}/${comissaoFilter.ano}/${comissaoFilter.mes}`
                  : '')
              }
              variant='contained'
              startIcon={<i className='tabler-article' />}
              className='is-full sm:is-auto'
            >
              Ver extrato completo das comissões
            </Button>
          }
        />
        <div className='flex justify-between flex-col items-start md:flex-row md:items-center p-6 border-bs gap-4'>
          <CustomTextField
            select
            value={table.getState().pagination.pageSize}
            onChange={e => table.setPageSize(Number(e.target.value))}
            className='is-[70px]'
          >
            <MenuItem value='10'>10</MenuItem>
            <MenuItem value='25'>25</MenuItem>
            <MenuItem value='50'>50</MenuItem>
          </CustomTextField>
          <div className='flex flex-col sm:flex-row is-full items-start sm:items-center gap-4'>
            <CustomTextField
              select
              value={comissaoFilter.token || 'all'}
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
              value={comissaoFilter.mes || 'all'}
              onChange={e => setComissaoFilter({ ...comissaoFilter, mes: e.target.value })}
            >
              <MenuItem value='all' selected={'all' == comissaoFilter.mes}>
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
              value={comissaoFilter.ano || 'all'}
              onChange={e => setComissaoFilter({ ...comissaoFilter, ano: e.target.value })}
            >
              <MenuItem value='all' selected={'all' == comissaoFilter.mes}>
                Todos os anos
              </MenuItem>
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
              href={
                `/financeiro/comissao/gestor/` +
                (comissaoFilter.token != 'all'
                  ? comissaoFilter.ano != 'all' && comissaoFilter.mes != 'all'
                    ? `${comissaoFilter.token}/${comissaoFilter.ano}/${comissaoFilter.mes}`
                    : `${comissaoFilter.token}`
                  : '')
              }
              variant='contained'
              startIcon={<i className='tabler-refresh' />}
              className='is-full sm:is-auto'
              onClick={e => {
                if (
                  (comissaoFilter.ano != 'all' && comissaoFilter.mes == 'all') ||
                  (comissaoFilter.ano == 'all' && comissaoFilter.mes != 'all')
                ) {
                  e.preventDefault()
                  alert('Favor informar mes e ano')
                }

                return false
              }}
            >
              Atualizar
            </Button>
          </div>
        </div>
        <div className='flex justify-between flex-col items-start md:flex-row md:items-center p-6 border-bs gap-4'>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell align='center'>Qtd Contratos</TableCell>
                <TableCell align='center'>Maior Taxa</TableCell>
                <TableCell align='center'>Menor Taxa</TableCell>
                <TableCell align='center'>Valor Médio</TableCell>
                <TableCell align='center'>Valor Total</TableCell>
                <TableCell align='center'>Repasse Médio</TableCell>
                <TableCell align='center'>Total Repasse</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell align='center'>{totais?.totalRegistros}</TableCell>
                <TableCell align='center'>{valorBr.format(totais?.maiorTaxa || 0)}%</TableCell>
                <TableCell align='center'>{valorBr.format(totais?.menorTaxa || 0)}%</TableCell>
                <TableCell align='center'>{valorBr.format(totais?.valorMedio || 0)}</TableCell>
                <TableCell align='center'>{valorBr.format(totais?.valorTotal || 0)}</TableCell>
                <TableCell align='center'>{valorBr.format(totais?.repasseMedio || 0)}</TableCell>
                <TableCell align='center'>{valorBr.format(totais?.totalRepasse || 0)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <div className='overflow-x-auto'>
          <table className={tableStyles.table}>
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id}>
                      {header.isPlaceholder ? null : (
                        <>
                          <div
                            className={classnames({
                              'flex items-center': header.column.getIsSorted(),
                              'cursor-pointer select-none': header.column.getCanSort()
                            })}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {{
                              asc: <i className='tabler-chevron-up text-xl' />,
                              desc: <i className='tabler-chevron-down text-xl' />
                            }[header.column.getIsSorted() as 'asc' | 'desc'] ?? null}
                          </div>
                        </>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            {table.getFilteredRowModel().rows.length === 0 ? (
              <tbody>
                <tr>
                  <td colSpan={table.getVisibleFlatColumns().length} className='text-center'>
                    Nenhum registro localizado
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                {table
                  .getRowModel()
                  .rows.slice(0, table.getState().pagination.pageSize)
                  .map(row => {
                    return (
                      <>
                        <tr key={row.id} className={classnames({ selected: row.getIsSelected() })}>
                          {row.getVisibleCells().map(cell => (
                            <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                          ))}
                        </tr>
                        {row.getIsExpanded() && (
                          <tr>
                            {/* 2nd row is a custom 1 cell row */}
                            <td colSpan={row.getVisibleCells().length}>{renderSubComponent({ row })}</td>
                          </tr>
                        )}
                      </>
                    )
                  })}
              </tbody>
            )}
          </table>
        </div>
        <TablePagination
          component={() => <TablePaginationComponent table={table} />}
          count={table.getFilteredRowModel().rows.length}
          rowsPerPage={table.getState().pagination.pageSize}
          page={table.getState().pagination.pageIndex}
          onPageChange={(_, page) => {
            table.setPageIndex(page)
          }}
        />
      </Card>
    </>
  )
}

export default ComissaoParceirosListTable
