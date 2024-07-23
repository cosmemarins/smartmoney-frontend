'use client'

// React Imports
import { useEffect, useMemo, useState } from 'react'

import type { TextFieldProps } from '@mui/material'
import {
  Button,
  Card,
  CardHeader,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Link,
  MenuItem,
  TablePagination,
  Typography
} from '@mui/material'

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

import CustomTextField from '@/@core/components/mui/TextField'
import { type ContratoType, type ContratoTypeWithAction } from '@/types/ContratoType'

// Style Imports
import tableStyles from '@core/styles/table.module.css'
import TablePaginationComponent from '@/components/TablePaginationComponent'
import DialogConfirma from '@/components/DialogConfirma'
import type { DialogConfirmaType } from '@/types/utilTypes'
import ContratoService from '@/services/ContratoService'
import { trataErro } from '@/utils/erro'
import { StatusContratoEnum, getStatusContratoEnumColor } from '@/utils/enums/StatusContratoEnum'
import ContratoEdit from '../ContratoEdit'
import { cpfCnpjMask, valorBr } from '@/utils/string'
import Documentacao from './documentacao'

locale('pt-br')

// Column Definitions
const columnHelper = createColumnHelper<ContratoTypeWithAction>()

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

const ContratoListTable = () => {
  // States
  const [rowSelection, setRowSelection] = useState({})
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [data, setData] = useState<ContratoType[]>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [dialogConfirma, setDialogConfirma] = useState<DialogConfirmaType>({ open: false })
  const [contratoExcluir, setContratoExcluir] = useState<ContratoType | undefined>()
  const [contratoEdit, setContratoEdit] = useState<ContratoType>()
  const [refreshTable, setRefreshTable] = useState<boolean>(true)
  const [openDlgContrato, setOpenDlgContrato] = useState<boolean>(false)
  const [openDlgDocumentacao, setOpenDlgDocumentacao] = useState<boolean>(false)

  const handleOpenDlgContrato = (contrato: ContratoType) => {
    setContratoEdit(contrato)
    setOpenDlgContrato(true)
  }

  const handleCloseDlgContrato = (refresh: boolean) => {
    setOpenDlgContrato(false)

    if (refresh) {
      setRefreshTable(true)
    }
  }

  const handleOpenDlgDocumentacao = (contrato: ContratoType) => {
    setContratoEdit(contrato)
    setOpenDlgDocumentacao(true)
  }

  const handleCloseDlgDocumentacao = (refresh: boolean) => {
    setOpenDlgDocumentacao(false)

    if (refresh) {
      setRefreshTable(refresh)
    }
  }

  const handleOpenDlgConfirmaExcluir = (contrato: ContratoType) => {
    setContratoExcluir(contrato)
  }

  const handleExcluirContrato = () => {
    if (contratoExcluir?.token) {
      ContratoService.excluirContrato(contratoExcluir?.token)
        .then(() => {
          setContratoExcluir(undefined)
          setRefreshTable(true)

          //console.log('respContrato', respContrato)
          toast.success(`Contrato ${contratoExcluir?.token} excluído!`)
        })
        .catch((err: any) => {
          const erro = trataErro(err)

          console.error(erro)
          toast.error(trataErro(erro))
        })
        .finally(() => {})
    }
  }

  const columns = useMemo<ColumnDef<ContratoTypeWithAction, any>[]>(
    () => [
      columnHelper.accessor('data', {
        header: 'Data',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <div className='flex flex-col'>
              <Typography color='text.primary' className='font-medium'>
                {moment(row.original.data).format('DD/MM/YYYY HH:mm')}
              </Typography>
              <Typography variant='body2'>Contrato: {row.original.token}</Typography>
            </div>
          </div>
        )
      }),
      columnHelper.accessor('cliente.nome', {
        header: 'Cliente',
        cell: ({ row }) => (
          <div className='flex flex-col'>
            <Link href={`/cliente/${row.original.cliente?.token}`} title='Ir para o cadastro do cliente'>
              <Typography color='text.primary' className='font-medium'>
                {row.original.cliente?.nome}
              </Typography>
            </Link>
            <Typography variant='body2'>
              {row.original.cliente?.tipoPessoa === 'F' ? 'CPF: ' : 'CNPJ :'}{' '}
              {cpfCnpjMask(row.original.cliente?.cpfCnpj)}
            </Typography>
            <Typography variant='body2'>Celular: {row.original.cliente?.telefone}</Typography>{' '}
          </div>
        )
      }),
      columnHelper.accessor('cliente.gestor.parceiro', {
        header: 'Parceiro',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <div className='flex flex-col'>
              <Typography color='text.primary' className='font-medium'>
                {row.original.cliente?.gestor?.parceiro?.nomeFantasia}
              </Typography>
              <Typography variant='body2'>CNPJ: {cpfCnpjMask(row.original.cliente?.gestor?.parceiro?.cnpj)}</Typography>
              <Typography variant='body2'>Celular: {row.original.cliente?.gestor?.parceiro?.telefone}</Typography>
            </div>
          </div>
        )
      }),

      /*
      columnHelper.accessor('cliente.email', {
        header: 'Contato',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <div className='flex flex-col'>
              <Typography color='text.primary' className='font-medium'>
                {row.original.cliente?.email}
              </Typography>
              <Typography variant='body2'>celular: {row.original.cliente?.telefone}</Typography>
            </div>
          </div>
        )
      }),
      */
      columnHelper.accessor('cliente.gestor', {
        header: 'Gestor',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <div className='flex flex-col'>
              <Typography color='text.primary' className='font-medium'>
                {row.original.cliente?.gestor?.nome}
              </Typography>
              <Typography variant='body2'>{row.original.cliente?.gestor?.email}</Typography>
              <Typography variant='body2'>celular: {row.original.cliente?.gestor?.telefone}</Typography>
            </div>
          </div>
        )
      }),
      columnHelper.accessor('saldo', {
        header: 'Saldo',
        cell: ({ row }) => (
          <div className='text-center'>
            <Typography color='text.primary' className='font-medium'>
              {valorBr.format(Number(row.original.saldo))}
            </Typography>
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
              color={getStatusContratoEnumColor(row.original.status || 'default')}
              size='small'
              sx={{ fontSize: '10px' }}
            />
          </div>
        )
      }),
      columnHelper.accessor('action', {
        header: 'Ação',
        cell: ({ row }) => (
          <div className='flex items-center'>
            {(row.original.status == StatusContratoEnum.ATIVO ||
              row.original.status == StatusContratoEnum.AGUARDANDO ||
              row.original.status == StatusContratoEnum.NOVO) && (
              <IconButton onClick={() => handleOpenDlgDocumentacao(row.original)} title='Documentação do contrato'>
                <i className='tabler-paperclip text-[22px] text-textSecondary' />
              </IconButton>
            )}
            <IconButton>
              <Link href={`/contrato/${row.original.token}/extrato`} title='Extrato'>
                <i className='tabler-file-description text-[22px] text-textSecondary' />
              </Link>
            </IconButton>
            <IconButton onClick={() => handleOpenDlgContrato(row.original)}>
              <i className='tabler-edit text-[22px] text-textSecondary' />
            </IconButton>
            {row.original.status == StatusContratoEnum.NOVO && (
              <IconButton onClick={() => handleOpenDlgConfirmaExcluir(row.original)}>
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
    data: data as ContratoType[],
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
    if (contratoExcluir) {
      setDialogConfirma({
        open: true,
        titulo: 'Excluir Contrato',
        texto: (
          <div>
            Tem certeza que deseja excluir este contrato? <br />
            <br />
            {contratoExcluir.token}
          </div>
        ),
        botaoConfirma: 'Confirmar Exclusão',
        handleConfirma: handleExcluirContrato
      } as DialogConfirmaType)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contratoExcluir])

  useEffect(() => {
    if (refreshTable) {
      setRefreshTable(false)
      ContratoService.getList()
        .then(respListContrato => {
          setData(respListContrato)
        })
        .catch(err => {
          console.log('ERRO RESP', err)
        })
    }
  }, [refreshTable])

  return (
    <>
      <Card>
        <CardHeader title='Contratos' className='pbe-4' />
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
              placeholder='Localizar'
              className='is-full sm:is-auto'
            />
            <Button
              href='/contrato/new'
              variant='contained'
              startIcon={<i className='tabler-plus' />}
              className='is-full sm:is-auto'
            >
              Adicionar Contrato
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
      <DialogConfirma dialogConfirmaOptions={dialogConfirma} />
      <Dialog
        maxWidth='md'
        open={openDlgContrato}
        aria-labelledby='form-dialog-title'
        disableEscapeKeyDown
        onClose={(event, reason) => {
          if (reason !== 'backdropClick') {
            handleCloseDlgContrato(false)
          }
        }}
      >
        <DialogTitle id='form-dialog-title'>
          <Typography sx={{ fontSize: '20px', fontWeight: 'bold', float: 'left' }}>
            Cliente: {contratoEdit?.cliente?.nome}
          </Typography>
          <Typography sx={{ fontSize: '20px', fontWeight: 'bold', float: 'right' }}>
            Contrato: {contratoEdit?.token}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <ContratoEdit contrato={contratoEdit} handleClose={handleCloseDlgContrato} />
        </DialogContent>
      </Dialog>
      {contratoEdit && (
        <Dialog
          open={openDlgDocumentacao}
          maxWidth='xl'
          fullWidth={true}
          aria-labelledby='form-dialog-title'
          disableEscapeKeyDown
          onClose={(event, reason) => {
            if (reason !== 'backdropClick') {
              handleCloseDlgDocumentacao(false)
            }
          }}
        >
          <DialogTitle id='form-dialog-title'>
            <Typography sx={{ fontSize: '20px', fontWeight: 'bold', float: 'left' }}>
              Cliente: {contratoEdit?.cliente?.nome}
            </Typography>
            <Typography sx={{ fontSize: '20px', fontWeight: 'bold', float: 'right' }}>
              Contrato: {contratoEdit?.token}
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Documentacao contrato={contratoEdit} cliente={contratoEdit.cliente} />
          </DialogContent>
          <DialogActions className='dialog-actions-dense'>
            <Button
              variant='contained'
              startIcon={<i className='tabler-x' />}
              onClick={() => handleCloseDlgDocumentacao(false)}
            >
              Fechar
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  )
}

export default ContratoListTable
