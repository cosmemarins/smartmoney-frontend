'use client'

// React Imports
import { useEffect, useMemo, useState } from 'react'

// Type Imports
import { useSession } from 'next-auth/react'

import type { TextFieldProps } from '@mui/material'
import { Card, CardHeader, Chip, IconButton, Link, MenuItem, TablePagination, Typography } from '@mui/material'

import type { ColumnDef, ColumnFiltersState, FilterFn } from '@tanstack/react-table'
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

import CustomTextField from '@/@core/components/mui/TextField'
import type { ExtratoFilterType, ExtratoType, ExtratoTypeWithAction } from '@/types/ExtratoType'

// Style Imports
import tableStyles from '@core/styles/table.module.css'
import TablePaginationComponent from '@/components/TablePaginationComponent'
import DialogConfirma from '@/components/DialogConfirma'
import type { DialogConfirmaType } from '@/types/utilTypes'
import ExtratoService from '@/services/ExtratoService'
import { trataErro } from '@/utils/erro'
import { StatusExtratoEnum, StatusExtratoEnumList, getStatusExtratoEnumColor } from '@/utils/enums/StatusExtratoEnum'
import { cpfCnpjMask, valorBr } from '@/utils/string'
import { PerfilUsuarioEnum } from '@/utils/enums/PerfilUsuarioEnum'
import { isMaster, isParceiroMaster } from '@/utils/utils'
import { getTipoExtratoEnumColor } from '@/utils/enums/TipoExtratoEnum'

locale('pt-br')

// Column Definitions
const columnHelper = createColumnHelper<ExtratoTypeWithAction>()

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

const ExtratoListTable = () => {
  //hooks
  const { data: session } = useSession()

  // States
  const [rowSelection, setRowSelection] = useState({})
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [data, setData] = useState<ExtratoType[]>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [dialogConfirma, setDialogConfirma] = useState<DialogConfirmaType>({ open: false })
  const [extratoExcluir, setextratoExcluir] = useState<ExtratoType | undefined>()
  const [refreshTable, setRefreshTable] = useState<boolean>(true)
  const [ExtratoFilter, setExtratoFilter] = useState<ExtratoFilterType>()

  const handleOpenDlgConfirmaExcluir = (extrato: ExtratoType) => {
    setextratoExcluir(extrato)
  }

  const handleExcluirExtrato = () => {
    if (extratoExcluir?.token) {
      ExtratoService.excluir(extratoExcluir?.token)
        .then(() => {
          setextratoExcluir(undefined)
          setRefreshTable(true)

          //console.log('respContrato', respContrato)
          toast.success(`Lançamento ${extratoExcluir?.token} excluído!`)
        })
        .catch((err: any) => {
          console.error('err', err)
          const erro = trataErro(err)

          console.error(erro)
          toast.error(trataErro(erro))
        })
        .finally(() => {})
    }
  }

  const columns = useMemo<ColumnDef<ExtratoTypeWithAction, any>[]>(
    () => [
      columnHelper.accessor('token', {
        header: 'Data',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <div className='flex flex-col'>
              <Typography color='text.primary' className='font-medium'>
                {moment(row.original.data).utcOffset('+0300').format('DD/MM/YYYY')}
              </Typography>
              <Typography variant='body2'>Contrato: {row.original.token}</Typography>
            </div>
          </div>
        )
      }),
      columnHelper.accessor('contrato.cliente.nome', {
        header: 'Cliente',
        cell: ({ row }) => (
          <div className='flex flex-col'>
            <Link href={`/cliente/${row.original.contrato?.cliente?.token}`} title='Ir para o cadastro do cliente'>
              <Typography color='text.primary' className='font-medium'>
                {row.original.contrato?.cliente?.nome}
              </Typography>
            </Link>
            <Typography variant='body2'>
              {row.original.contrato?.cliente?.tipoPessoa === 'F' ? 'CPF: ' : 'CNPJ :'}{' '}
              {cpfCnpjMask(row.original.contrato?.cliente?.cpfCnpj)}
            </Typography>
            <Typography variant='body2'>Celular: {row.original.contrato?.cliente?.telefone}</Typography>{' '}
          </div>
        )
      }),
      columnHelper.accessor('contrato.cliente.gestor.nome', {
        header: 'Agente',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <div className='flex flex-col'>
              <Typography color='text.primary' className='font-medium'>
                {row.original.contrato?.cliente?.gestor?.nome}
              </Typography>
              <Typography variant='body2'>celular: {row.original.contrato?.cliente?.gestor?.telefone}</Typography>
              {row.original.contrato?.cliente?.gestor?.gestor && (
                <Typography variant='body2'>
                  Parceiro: {row.original.contrato?.cliente?.gestor?.gestor?.nome}
                  {session?.user.perfil != PerfilUsuarioEnum.AGENTE &&
                  row.original.contrato?.cliente?.gestor?.gestor?.gestor
                    ? ` -> ${row.original.contrato?.cliente?.gestor?.gestor?.gestor?.nome}`
                    : ''}
                </Typography>
              )}
            </div>
          </div>
        )
      }),
      columnHelper.accessor('tipo', {
        header: 'Tipo',
        cell: ({ row }) => (
          <div className='text-center'>
            <Chip
              variant='tonal'
              className='capitalize'
              label={row.original.tipo}
              color={getTipoExtratoEnumColor(row.original.tipo || 'default')}
              size='small'
              sx={{ fontSize: '10px' }}
            />
          </div>
        )
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: ({ row }) => (
          <div className='text-center'>
            <Chip
              variant='tonal'
              className='capitalize'
              label={row.original.status}
              color={getStatusExtratoEnumColor(row.original.status || 'default')}
              size='small'
              sx={{ fontSize: '10px' }}
            />
          </div>
        )
      }),
      columnHelper.accessor('valor', {
        header: 'Valor',
        cell: ({ row }) => (
          <div className='text-center'>
            <Typography color='text.primary' className='font-medium'>
              {valorBr.format(Number(row.original.valor || 0))}
            </Typography>
          </div>
        )
      }),
      columnHelper.accessor('action', {
        header: 'Ação',
        cell: ({ row }) => (
          <div className='flex items-center'>
            {(isMaster(session?.user) || isParceiroMaster(session?.user)) &&
              row.original.status == StatusExtratoEnum.NOVO && (
                <IconButton onClick={() => handleOpenDlgConfirmaExcluir(row.original)} title='Excluir Lançamento'>
                  <i className='tabler-trash text-[22px] text-textSecondary' />
                </IconButton>
              )}
          </div>
        ),
        enableSorting: false
      })
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const table = useReactTable({
    data: data as ExtratoType[],
    columns,
    filterFns: {
      fuzzy: fuzzyFilter
    },
    state: {
      rowSelection,
      globalFilter,
      columnFilters
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
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    debugColumns: false
  })

  useEffect(() => {
    setExtratoFilter({
      options: {
        page: 1,
        orderDirection: 'ASC'
      }
    })
  }, [])

  useEffect(() => {
    const filters = []

    if (ExtratoFilter?.status && ExtratoFilter?.status !== 'TODOS') {
      filters.push({
        id: 'status',
        value: ExtratoFilter?.status
      })
    }

    if (ExtratoFilter?.tipo && ExtratoFilter?.tipo !== 'TODOS') {
      filters.push({
        id: 'tipo',
        value: ExtratoFilter?.tipo
      })
    }

    setColumnFilters(filters)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ExtratoFilter])

  useEffect(() => {
    if (extratoExcluir) {
      setDialogConfirma({
        open: true,
        titulo: 'Excluir Lançamento',
        texto: (
          <div>
            Tem certeza que deseja excluir este lançamento? <br />
            <br />
            {extratoExcluir.token}
          </div>
        ),
        botaoConfirma: 'Confirmar Exclusão',
        handleConfirma: handleExcluirExtrato
      } as DialogConfirmaType)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [extratoExcluir])

  useEffect(() => {
    if (refreshTable) {
      setRefreshTable(false)
      ExtratoService.list()
        .then(respListExtrato => {
          //console.log('respListContrato', respListContrato)
          setData(respListExtrato)
        })
        .catch(err => {
          console.log('ERRO RESP', err)
        })
    }
  }, [refreshTable])

  return (
    <>
      <Card>
        <CardHeader className='pbe-4' title={<span>Lançamentos (Aportes / Aditivos)</span>} />

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
            <CustomTextField
              select
              label='Tipo Lançamento'
              value={ExtratoFilter?.tipo || 'TODOS'}
              onChange={e => setExtratoFilter({ ...ExtratoFilter, tipo: e.target.value })}
              sx={{ width: '170px' }}
            >
              <MenuItem value='TODOS' selected={ExtratoFilter?.tipo === 'TODOS'}>
                Todos
              </MenuItem>
              <MenuItem value='ADITIVO' selected={ExtratoFilter?.tipo === 'ADITIVO'}>
                Aditivo
              </MenuItem>
              <MenuItem value='APORTE' selected={ExtratoFilter?.tipo === 'APORTE'}>
                Aporte
              </MenuItem>
            </CustomTextField>
            <CustomTextField
              select
              label='Status'
              value={ExtratoFilter?.status || 'TODOS'}
              onChange={e => setExtratoFilter({ ...ExtratoFilter, status: e.target.value })}
              sx={{ width: '150px' }}
            >
              <MenuItem value='TODOS' selected={ExtratoFilter?.status === 'TODOS'}>
                Todos
              </MenuItem>
              {StatusExtratoEnumList.map((status, index) => (
                <MenuItem key={index} value={status.value} selected={ExtratoFilter?.status === status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </CustomTextField>
            <DebouncedInput
              label='Localizar'
              value={globalFilter ?? ''}
              onChange={value => setGlobalFilter(String(value))}
              placeholder='Digite um texto...'
              className='is-full sm:is-auto'
            />
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
      <DialogConfirma dialogConfirmaOptions={dialogConfirma} />
    </>
  )
}

export default ExtratoListTable
