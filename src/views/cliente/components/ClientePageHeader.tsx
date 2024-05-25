'use client'

// MUI Imports
import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'

import moment, { locale } from 'moment'
import 'moment/locale/pt-br'

// Type Imports
import { Chip } from '@mui/material'

import { useClienteContext } from '@/contexts/ClienteContext'
import { clienteStatusColors } from '@/types/ClienteType'

locale('pt-br')

const ClientePageHeader = () => {
  const { cliente } = useClienteContext()

  return (
    <Card>
      <CardMedia image='/images/pages/profile-banner.png' className='bs-[40px]' />
      <CardContent className='flex gap-5 justify-center flex-col items-center md:items-end md:flex-row !pt-0 md:justify-start'>
        <div className='flex rounded-bs-md mbs-[-30px] border-[5px] mis-[-5px] border-be-0  border-backgroundPaper bg-backgroundPaper'>
          <img
            height={120}
            width={120}
            src={cliente?.foto ? cliente?.foto : '/images/avatars/nobody.png'}
            className='rounded'
            alt='Profile Background'
          />
        </div>
        <div className='flex is-full justify-start self-end flex-col items-center gap-6 sm-gap-0 sm:flex-row sm:justify-between sm:items-end '>
          <div className='flex flex-col items-center sm:items-start gap-2'>
            <Typography variant='h4'>{cliente?.nome}</Typography>
            <div className='flex flex-wrap gap-6 justify-center sm:justify-normal'>
              <div className='flex items-center gap-2' style={{ textTransform: 'capitalize' }}>
                {cliente?.cidade && (
                  <>
                    <i className='tabler-map-pin' />
                    <Typography className='font-medium'>{cliente?.cidade}</Typography>
                  </>
                )}
              </div>
              <div className='flex items-center gap-2' style={{ textTransform: 'capitalize' }}>
                {cliente?.data && (
                  <>
                    <i className='tabler-calendar' />
                    <Typography className='font-medium'>
                      {cliente?.data ? moment(cliente?.data).format('MMMM YYYY') : ''}
                    </Typography>
                  </>
                )}
              </div>
            </div>
          </div>
          {cliente?.status && (
            <Chip
              icon={<i className='tabler-user-check' />}
              variant='filled'
              className='flex gap-2 capitalize'
              label={cliente?.status}
              color={clienteStatusColors[cliente?.status || 'primary']}
            />
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default ClientePageHeader
