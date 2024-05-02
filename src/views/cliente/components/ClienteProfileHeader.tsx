'use client'

// MUI Imports
import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

// Type Imports
import type { ClienteProfileHeaderType } from '@/types/ClienteType'

const ClienteProfileHeader = ({ data }: { data?: ClienteProfileHeaderType }) => {
  return (
    <Card>
      {data?.imagemCapa && <CardMedia image={data?.imagemCapa} className='bs-[40px]' />}
      <CardContent className='flex gap-5 justify-center flex-col items-center md:items-end md:flex-row !pt-0 md:justify-start'>
        <div className='flex rounded-bs-md mbs-[-30px] border-[5px] mis-[-5px] border-be-0  border-backgroundPaper bg-backgroundPaper'>
          <img height={120} width={120} src={data?.foto} className='rounded' alt='Profile Background' />
        </div>
        <div className='flex is-full justify-start self-end flex-col items-center gap-6 sm-gap-0 sm:flex-row sm:justify-between sm:items-end '>
          <div className='flex flex-col items-center sm:items-start gap-2'>
            <Typography variant='h4'>{data?.nome}</Typography>
            <div className='flex flex-wrap gap-6 justify-center sm:justify-normal'>
              <div className='flex items-center gap-2'>
                {data?.local && (
                  <>
                    <i className='tabler-map-pin' />
                    <Typography className='font-medium'>{data?.local}</Typography>
                  </>
                )}
              </div>
              <div className='flex items-center gap-2'>
                {data?.clienteDesde && (
                  <>
                    <i className='tabler-calendar' />
                    <Typography className='font-medium'>{data?.clienteDesde}</Typography>
                  </>
                )}
              </div>
            </div>
          </div>
          {data?.status && (
            <Button variant='contained' className='flex gap-2'>
              <i className='tabler-user-check !text-base'></i>
              <span>{data?.status}</span>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default ClienteProfileHeader
