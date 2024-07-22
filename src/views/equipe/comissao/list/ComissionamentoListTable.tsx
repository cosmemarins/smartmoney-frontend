'use client'

// React Imports
import { useEffect, useMemo, useState } from 'react'

import type { TextFieldProps } from '@mui/material'
import { Button, Card, CardHeader, MenuItem, TablePagination, Typography } from '@mui/material'

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

import axios from 'axios'
import moment, { locale } from 'moment'
import 'moment/locale/pt-br'

import CustomTextField from '@/@core/components/mui/TextField'
import { type ComissionamentoType, type ComissionamentoTypeAction } from '@/types/ComissionamentoType'

// Style Imports
import tableStyles from '@core/styles/table.module.css'
import TablePaginationComponent from '@/components/TablePaginationComponent'
import type { ValidationError } from '@/services/api'
import ParceiroService from '@/services/ParceiroService'
import { valorBr } from '@/utils/string'

locale('pt-br')

// Column Definitions
const columnHelper = createColumnHelper<ComissionamentoTypeAction>()

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

const ComissionamentoListTable = () => {
  // States
  const [rowSelection, setRowSelection] = useState({})
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [data, setData] = useState<ComissionamentoType[]>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [refreshTable, setRefreshTable] = useState<boolean>(true)

  const columns = useMemo<ColumnDef<ComissionamentoTypeAction, any>[]>(
    () => [
      columnHelper.accessor('nomeCliente', {
        header: 'Cliente',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <div className='flex flex-col'>
              <Typography color='text.primary' className='font-medium'>
                {row.original.nomeCliente}
              </Typography>
            </div>
          </div>
        )
      }),
      columnHelper.accessor('valor', {
        header: 'Valor',
        cell: ({ row }) => <Typography color='text.primary'>{valorBr.format(row.original.valor || 0)}</Typography>
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
      columnHelper.accessor('nomeGestor', {
        header: 'Broker',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.nomeGestor}</Typography>
      }),
      columnHelper.accessor('taxaAgente', {
        header: 'Taxa',
        cell: ({ row }) => <Typography color='text.primary'>{valorBr.format(row.original.taxaAgente || 0)}%</Typography>
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
    data: data as ComissionamentoType[],
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
      ParceiroService.getComissionamento()
        .then(respListComissao => {
          console.log('respListComissao', respListComissao)
          setData(respListComissao)
        })
        .catch((err: any) => {
          if (axios.isAxiosError<ValidationError, Record<string, unknown>>(err)) {
            console.log(err.status)
            console.error(err.response)
            toast.error(`Erro, ${err.status}`)
          } else {
            console.error(err)
            toast.error(`Erro`, err)
          }
        })
    }
  }, [refreshTable])

  return (
    <>
      <Card>
        <CardHeader title='Comissionamento' className='pbe-4' />
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
              href='/equipe/new'
              variant='contained'
              startIcon={<i className='tabler-plus' />}
              className='is-full sm:is-auto'
            >
              Adicionar Usuário
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

export default ComissionamentoListTable
