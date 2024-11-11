'use client'

// MUI Imports
import { useEffect, useState } from 'react'

import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'

// Components Imports
import { IconButton, Link } from '@mui/material'

// Style Imports
import tableStyles from '@core/styles/table.module.css'
import ContratoService from '@/services/ContratoService'
import type { ContratoFilterType, ContratoType } from '@/types/ContratoType'
import { valorBr } from '@/utils/string'

const ContratosValoresPendentes = () => {
  const [data, setData] = useState<ContratoType[]>([])

  useEffect(() => {
    const contratoFilter: ContratoFilterType = {
      tipoSaldo: 'COM_PENDENCIA'
    }

    ContratoService.getList(contratoFilter)
      .then(respListContrato => {
        console.log('respListContrato', respListContrato)
        setData(respListContrato)
      })
      .catch(err => {
        console.log('ERRO RESP', err)
      })
  }, [])

  return (
    <Card>
      <CardHeader title='Contratos com valores pendentes' />
      <div className='overflow-x-auto'>
        <table className={tableStyles.table}>
          <thead className='uppercase'>
            <tr className='border-be'>
              <th className='leading-6 plb-4 pis-6 pli-2'>Cliente</th>
              <th className='leading-6 plb-4 pli-2'>Agente</th>
              <th className='leading-6 plb-4 pli-2 text-center'>Valor Pendente</th>
              <th className='leading-6 plb-4 pie-6 pli-2 text-right'></th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index} className='border-0'>
                <td className='pis-6 pli-2 plb-3'>
                  <div className='flex items-center gap-4'>{row.cliente?.nome}</div>
                </td>
                <td className='pli-2 plb-3'>
                  <div className='flex flex-col'>{row.cliente?.gestor?.nome}</div>
                </td>
                <td className='pli-2 plb-3  text-center'>{valorBr.format(Number(row.saldoPendente))}</td>
                <td className='pli-2 plb-3 pie-6 text-center'>
                  <IconButton>
                    <Link href={`/contrato/${row.token}/extrato`} title='Extrato'>
                      <i className='tabler-eye text-[22px] text-textSecondary' />
                    </Link>
                  </IconButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

export default ContratosValoresPendentes
