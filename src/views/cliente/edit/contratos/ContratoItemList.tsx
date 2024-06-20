import { useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'

import moment, { locale } from 'moment'
import 'moment/locale/pt-br'

import { Chip, Typography } from '@mui/material'

import type { ContratoType } from '@/types/ContratoType'
import { valorBr, valorEmReal } from '@/utils/string'
import { getStatusContratoEnumColor, getStatusContratoEnumDesc } from '@/utils/enums/StatusContratoEnum'

locale('pt-br')

interface props {
  handleOnSelect: any
  contratoList: ContratoType[]
}

const ContratoItemList = ({ handleOnSelect, contratoList }: props) => {
  // States
  // const [contratoList, setContratoList] = useState<ContratoType[]>([])
  const [selectedItem, setSelectedItem] = useState('')

  const handleOnClick = (contrato: ContratoType | undefined) => {
    if (contrato?.token) {
      setSelectedItem(contrato.token)
      handleOnSelect(contrato)
    }
  }

  return (
    <>
      {contratoList.map((contrato, key) => (
        <Card
          key={key}
          sx={{
            mb: 4,
            backgroundColor: `${selectedItem === contrato.token ? 'inherit' : '#eee'}`,
            cursor: 'pointer',
            ':hover': {
              boxShadow: 20, // theme.shadows[20]
              backgroundColor: 'inherit'
            }
          }}
          onClick={() => handleOnClick(contrato)}

          // onMouseOver={handleOver()}
        >
          <CardContent sx={{ p: theme => `${theme.spacing(3, 5.25, 4)} !important` }}>
            <Typography variant={`${selectedItem === contrato.token ? 'h6' : 'body1'}`} sx={{ mb: 2 }}>
              <span>{`${moment(contrato?.data).format('DD-MM-YYYY')} - ${contrato.token}`}</span>
              <span style={{ float: 'right' }}>{contrato?.saldo ? valorEmReal.format(contrato?.saldo) : '0,00'}</span>
            </Typography>
            <Chip
              size='small'
              variant='tonal'
              label={`${contrato.prazo} meses`}
              color='primary'
              icon={<i className='tabler-calendar-repeat' />}
              sx={{
                mr: 1.5,
                fontSize: `${selectedItem === contrato.token ? '' : '12px'}`,
                height: `${selectedItem === contrato.token ? '' : '20px'}`
              }}
            />
            <Chip
              size='small'
              variant='tonal'
              label={contrato?.taxaCliente ? valorBr.format(contrato?.taxaCliente) : ''}
              color='primary'
              icon={<i className='tabler-percentage' />}
              sx={{
                mr: 1.5,
                fontSize: `${selectedItem === contrato.token ? '' : '12px'}`,
                height: `${selectedItem === contrato.token ? '' : '20px'}`
              }}
            />
            <Chip
              size='small'
              variant='tonal'
              label={contrato?.valor ? valorBr.format(contrato?.valor) : ''}
              color='primary'
              icon={<i className='tabler-currency-dollar' />}
              sx={{
                mr: 1.5,
                fontSize: `${selectedItem === contrato.token ? '' : '12px'}`,
                height: `${selectedItem === contrato.token ? '' : '20px'}`
              }}
            />
            <Chip
              size='small'
              variant='tonal'
              label={contrato.status ? getStatusContratoEnumDesc(contrato.status) : ''}
              color={contrato.status ? getStatusContratoEnumColor(contrato.status) : 'default'}
              sx={{
                float: 'right',
                fontSize: `${selectedItem === contrato.token ? '' : '12px'}`,
                height: `${selectedItem === contrato.token ? '' : '20px'}`
              }}
            />
          </CardContent>
        </Card>
      ))}
    </>
  )
}

export default ContratoItemList
