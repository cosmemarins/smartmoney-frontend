'use client'

// MUI Imports
import { useEffect, useState } from 'react'

import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'

// Components Imports
import { Chip } from '@mui/material'

// Style Imports
import moment, { locale } from 'moment'

import tableStyles from '@core/styles/table.module.css'
import type { ExtratoType } from '@/types/ExtratoType'
import { getStatusContratoEnumColor } from '@/utils/enums/StatusContratoEnum'
import ExtratoService from '@/services/ExtratoService'

locale('pt-br')

const LastAditivos = () => {
  const [data, setData] = useState<ExtratoType[]>([])

  useEffect(() => {
    ExtratoService.getLastAditivo(10)
      .then(respListExtrato => {
        console.log('respListContrato', respListExtrato)
        setData(respListExtrato)
      })
      .catch(err => {
        console.log('ERRO RESP', err)
      })
  }, [])

  return (
    <Card>
      <CardHeader title='Últimos Aditivos' />
      <div className='overflow-x-auto'>
        <table className={tableStyles.table}>
          <thead className='uppercase'>
            <tr className='border-be'>
              <th className='leading-6 plb-4 pis-6 pli-2 text-center'>Data</th>
              <th className='leading-6 plb-4 pli-2'>Cliente</th>
              <th className='leading-6 plb-4 pli-2'>Agente</th>
              <th className='leading-6 plb-4 pie-6 pli-2 text-center'>Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index} className='border-0'>
                <td className='pis-6 pli-2 plb-3'>
                  <div className='flex items-center gap-4'>
                    {moment(row.data).utcOffset('+0300').format('DD/MM/YYYY')}
                  </div>
                </td>
                <td className='pli-2 plb-3'>
                  <div className='flex flex-col'>{row.contrato.cliente?.nome}</div>
                </td>
                <td className='pli-2 plb-3'>{row.contrato?.gestor?.nome || row.contrato?.cliente?.gestor?.nome}</td>
                <td className='pli-2 plb-3'>
                  <div className='text-center'>
                    <Chip
                      variant='tonal'
                      className='capitalize'
                      label={row.status}
                      color={getStatusContratoEnumColor(row.status || 'default')}
                      size='small'
                      sx={{ fontSize: '10px' }}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

export default LastAditivos
