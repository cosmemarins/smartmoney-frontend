'use client'

// React Imports
import { useEffect, useMemo, useState } from 'react'

import type { TextFieldProps } from '@mui/material'
import { Button, Card, CardHeader, Chip, IconButton, Link, MenuItem, TablePagination, Typography } from '@mui/material'

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

import CustomTextField from '@/@core/components/mui/TextField'
import { usuarioStatusColors, type UsuarioType, type UsuarioTypeWithAction } from '@/types/UsuarioType'
import CustomAvatar from '@/@core/components/mui/Avatar'
import { getInitials } from '@/utils/getInitials'

// Style Imports
import tableStyles from '@core/styles/table.module.css'
import TablePaginationComponent from '@/components/TablePaginationComponent'
import DialogConfirma from '@/components/DialogConfirma'
import type { DialogConfirmaType } from '@/types/utilTypes'
import UsuarioService from '@/services/UsuarioService'
import { cpfCnpjMask } from '@/utils/string'
import { trataErro } from '@/utils/erro'
import { getPerfilUsuarioEnumDesc, PerfilUsuarioEnum } from '@/utils/enums/PerfilUsuarioEnum'
import { StatusUsuarioEnum } from '@/utils/enums/StatusUsuarioEnum'
import { useEquipeContext } from '@/contexts/EquipeContext'

// Column Definitions
const columnHelper = createColumnHelper<UsuarioTypeWithAction>()

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

interface Props {
  perfil: string
}

const UsuarioListTable = ({ perfil }: Props) => {
  const { globalFilter, setGlobalFilterContext } = useEquipeContext()

  // States
  const [rowSelection, setRowSelection] = useState({})
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [data, setData] = useState<UsuarioType[]>([])
  const [dialogConfirma, setDialogConfirma] = useState<DialogConfirmaType>({ open: false })
  const [usuarioExcluir, setUsuarioExcluir] = useState<UsuarioType | undefined>()
  const [usuarioEdit, setUsuarioEdit] = useState<UsuarioType | undefined>()
  const [refreshTable, setRefreshTable] = useState<boolean>(true)

  const handleLimparFiltros = () => {
    setGlobalFilterContext('')
  }

  const handleOpenDlgConfirmaExcluir = (usuario: UsuarioType) => {
    setUsuarioExcluir(usuario)
  }

  const handleAtivarUsuario = (usuario: UsuarioType) => {
    //TIP: para setar o usuario foi preciso colocar o { ...usuario }, pq se usar apenas "usuario",
    //o react não atualizar e não dispara o useeffect
    setUsuarioEdit({ ...usuario })
  }

  const confirmAtivarUsuario = () => {
    if (usuarioEdit && usuarioEdit.token) {
      UsuarioService.ativar(usuarioEdit?.token)
        .then(() => {
          setRefreshTable(true)
          toast.success(`Usuário ${usuarioEdit?.nome} ativado com sucesso!`)
          setUsuarioEdit(undefined)
        })
        .catch((err: any) => {
          toast.error(trataErro(err))
        })
        .finally(() => {})
    }
  }

  useEffect(() => {
    if (usuarioEdit) {
      setDialogConfirma({
        open: true,
        titulo: 'Ativar Usuário',
        texto: (
          <div>
            Tem certeza que deseja ativar o usuário? <br />
            <br />
            {usuarioEdit.nome}
          </div>
        ),
        botaoConfirma: 'Ativar',
        handleConfirma: confirmAtivarUsuario
      } as DialogConfirmaType)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usuarioEdit])

  useEffect(() => {
    if (usuarioExcluir) {
      setDialogConfirma({
        open: true,
        titulo: 'Excluir Usuário',
        texto: (
          <div>
            Tem certeza que deseja excluir o usuário? <br />
            <br />
            {usuarioExcluir?.nome}
          </div>
        ),
        botaoConfirma: 'Confirmar Exclusão',
        handleConfirma: handleExcluirUsuario
      } as DialogConfirmaType)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usuarioExcluir])

  const handleExcluirUsuario = () => {
    if (usuarioExcluir?.token) {
      UsuarioService.excluir(usuarioExcluir.token)
        .then(() => {
          setUsuarioExcluir(undefined)
          setRefreshTable(true)

          toast.success(`Usuário ${usuarioExcluir.nome} excluído!`)
        })
        .catch((err: any) => {
          toast.error(trataErro(err))
        })
        .finally(() => {})
    }
  }

  const columns = useMemo<ColumnDef<UsuarioTypeWithAction, any>[]>(
    () => [
      columnHelper.accessor('nome', {
        header: 'Usuário',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            {getAvatar({ foto: row.original.foto, nome: row.original.nome })}
            <div className='flex flex-col'>
              <Typography color='text.primary' className='font-medium'>
                {row.original.nome}
              </Typography>
              <Typography variant='body2'>{cpfCnpjMask(row.original.cpfCnpj)}</Typography>
            </div>
          </div>
        )
      }),
      columnHelper.accessor('gestor.nome', {
        header: 'Gestor',
        cell: ({ row }) => (
          <div className='flex flex-col'>
            <Typography color='text.primary' className='font-medium'>
              {row.original.gestor?.nome}
            </Typography>
            <Typography variant='body2'>{cpfCnpjMask(row.original.gestor?.cpfCnpj)}</Typography>
          </div>
        )
      }),
      columnHelper.accessor('email', {
        header: 'Contato',
        cell: ({ row }) => (
          <div className='flex flex-col'>
            <Typography color='text.primary' className='font-medium'>
              {row.original.email}
            </Typography>
            <Typography color='text.primary'>{row.original.telefone}</Typography>
          </div>
        )
      }),
      columnHelper.accessor('perfil', {
        header: 'Perfil',
        cell: ({ row }) => <Typography color='text.primary'>{getPerfilUsuarioEnumDesc(row.original.perfil)}</Typography>
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: ({ row }) => (
          <div className='flex items-center gap-3'>
            <Chip
              variant='tonal'
              className='capitalize'
              label={row.original.status}
              color={usuarioStatusColors[row.original.status || 'primary']}
              size='small'
            />
          </div>
        )
      }),
      columnHelper.accessor('action', {
        header: 'Action',
        cell: ({ row }) => (
          <div className='flex items-center'>
            {row.original.status != StatusUsuarioEnum.ATIVO && (
              <IconButton
                title='Ativar usuário'
                aria-label='capture screenshot'
                onClick={() => {
                  handleAtivarUsuario(row.original)
                }}
              >
                <i className='tabler-check' />
              </IconButton>
            )}
            <IconButton onClick={() => handleOpenDlgConfirmaExcluir(row.original)}>
              <i className='tabler-trash text-[22px] text-textSecondary' />
            </IconButton>
            <IconButton>
              <Link href={`${row.original.token}`} className='flex'>
                <i className='tabler-edit text-[22px] text-textSecondary' />
              </Link>
            </IconButton>
          </div>
        ),
        enableSorting: false
      })
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const getAvatar = (params: Pick<UsuarioType, 'foto' | 'nome'>) => {
    const { foto, nome } = params

    if (foto) {
      return <CustomAvatar src={foto} size={34} />
    } else {
      return <CustomAvatar size={34}>{getInitials(nome as string)}</CustomAvatar>
    }
  }

  const table = useReactTable({
    data: data as UsuarioType[],
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
    enableRowSelection: true,
    globalFilterFn: fuzzyFilter,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    onGlobalFilterChange: setGlobalFilterContext,
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
      UsuarioService.getList(perfil)
        .then(respListUsuario => {
          setData(respListUsuario)
        })
        .catch((err: any) => {
          toast.error(trataErro(err))
        })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshTable])

  return (
    <>
      <Card>
        <CardHeader title={`Equipe: ${getPerfilUsuarioEnumDesc(perfil).toUpperCase()}`} className='pbe-4' />
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
              onChange={value => setGlobalFilterContext(String(value))}
              placeholder='Localizar Usuário'
              className='is-full sm:is-auto'
            />
            <Button
              variant='outlined'
              color='secondary'
              onClick={handleLimparFiltros}
              startIcon={<i className='tabler-filter-off' />}
              sx={{ whiteSpace: 'nowrap', height: '100%', minHeight: '40px' }}
            >
              Limpar
            </Button>
            <Button
              href={`/equipe/${perfil === PerfilUsuarioEnum.AGENTE ? 'agentes' : perfil === PerfilUsuarioEnum.PARCEIRO ? 'parceiros' : 'colaboradores'}/new`}
              variant='contained'
              startIcon={<i className='tabler-plus' />}
              className='is-full sm:is-auto'
            >
              Novo {getPerfilUsuarioEnumDesc(perfil)}
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
    </>
  )
}

export default UsuarioListTable
