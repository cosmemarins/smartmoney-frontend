'use client'

// React Imports
import { useEffect, useMemo, useState } from 'react'

// Type Imports
import { useSession } from 'next-auth/react'

import type { TextFieldProps } from '@mui/material'
import { Button, Card, CardHeader, MenuItem, TablePagination, Typography } from '@mui/material'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'

import type { ColumnDef, FilterFn } from '@tanstack/react-table'
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
  getSortedRowModel
} from '@tanstack/react-table'

import classnames from 'classnames'

import { rankItem } from '@tanstack/match-sorter-utils'

import { toast } from 'react-toastify'

import moment, { locale } from 'moment'
import 'moment/locale/pt-br'

import CustomTextField from '@/@core/components/mui/TextField'
import { type ComissaoType, type ComissaoTypeAction } from '@/types/ComissaoType'

// Style Imports
import tableStyles from '@core/styles/table.module.css'
import TablePaginationComponent from '@/components/TablePaginationComponent'
import { valorBr } from '@/utils/string'
import FinanceiroService from '@/services/FinanceiroService'
import { trataErro } from '@/utils/erro'
import type { TotaisComissaoType } from '@/types/TotaisComissaoType'
import { PerfilUsuarioEnum } from '@/utils/enums/PerfilUsuarioEnum'

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

const DebouncedInput = ({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number
  onChange: (value: string | number) => void
  debounce?: number
} & Omit<TextFieldProps, 'onChange'>) => {
  // States
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return <CustomTextField {...props} value={value} onChange={e => setValue(e.target.value)} />
}

const ComissaoInvestidoresListTable = () => {
  //hooks
  const { data: session } = useSession()

  // States
  const [rowSelection, setRowSelection] = useState({})
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [data, setData] = useState<ComissaoType[]>([])
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
                  {row.original.parceiro2 && ` -> ${row.original.nomeParceiro2}`}
                  {row.original.parceiro3 && ` -> ${row.original.nomeParceiro3}`}
                </Typography>
              )}
            </div>
          </div>
        )
      }),
      columnHelper.accessor('dataAporte', {
        header: 'Data Aporte',
        cell: ({ row }) => (
          <Typography color='text.primary'>{moment(row.original.dataAporte).format('DD/MM/YYYY')}</Typography>
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
        cell: ({ row }) => <Typography color='text.primary'>{valorBr.format(row.original.saldo || 0)}</Typography>
      }),
      columnHelper.accessor('taxa', {
        header: 'Taxa',
        cell: ({ row }) => <Typography color='text.primary'>{valorBr.format(row.original.taxa || 0)}%</Typography>
      }),
      columnHelper.accessor('valorRepasse', {
        header: 'Valor Repasse',
        cell: ({ row }) => (
          <Typography color='text.primary'>{valorBr.format(row.original.valorRepasse || 0)}</Typography>
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
    getFacetedMinMaxValues: getFacetedMinMaxValues()
  })

  useEffect(() => {
    if (refreshTable) {
      setRefreshTable(false)
      FinanceiroService.getComissaoInvestidores(session?.user.token)
        .then(respComissaoView => {
          console.log('respComissaoView', respComissaoView)
          setData(respComissaoView.listComissao)
          setTotais(respComissaoView.totaisComissao)
        })
        .catch((err: any) => {
          const msgErro = trataErro(err)

          toast.error(`Erro, ${msgErro}`)
        })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshTable])

  return (
    <>
      <Card>
        <CardHeader title='Comissões dos Investidores' className='pbe-4' />
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
          <div className='flex flex-col sm:flex-row is-full sm:is-auto items-start sm:items-center gap-4'>
            <DebouncedInput
              value={globalFilter ?? ''}
              onChange={value => setGlobalFilter(String(value))}
              placeholder='Localizar Usuário'
              className='is-full sm:is-auto'
            />
            <Button
              href='/financeiro/comissao/investidores'
              variant='contained'
              startIcon={<i className='tabler-refresh' />}
              className='is-full sm:is-auto'
            >
              Atualizar
            </Button>
          </div>
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
                      <tr key={row.id} className={classnames({ selected: row.getIsSelected() })}>
                        {row.getVisibleCells().map(cell => (
                          <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                        ))}
                      </tr>
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

export default ComissaoInvestidoresListTable
