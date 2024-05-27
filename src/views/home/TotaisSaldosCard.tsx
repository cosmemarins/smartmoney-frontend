'use client'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'

// Third Party Imports
import classnames from 'classnames'

// Types Imports
import type { ThemeColor } from '@core/types'

// Components Imports
import CustomAvatar from '@core/components/mui/Avatar'

type DataType = {
  stats: string
  title: string
  progress: number
  avatarIcon: string
  avatarColor?: ThemeColor
  progressColor?: ThemeColor
}

const data: DataType[] = [
  {
    title: 'Earnings',
    progress: 64,
    stats: '$545.69',
    progressColor: 'primary',
    avatarColor: 'primary',
    avatarIcon: 'tabler-currency-dollar'
  },
  {
    title: 'Profit',
    progress: 59,
    stats: '$256.34',
    progressColor: 'info',
    avatarColor: 'info',
    avatarIcon: 'tabler-chart-pie-2'
  },
  {
    title: 'Expense',
    progress: 22,
    stats: '$74.19',
    progressColor: 'error',
    avatarColor: 'error',
    avatarIcon: 'tabler-brand-paypal'
  }
]

const TotaisSaldosCard = () => {
  return (
    <Card>
      <CardHeader
        avatar={<i className='tabler-list-details text-xl' />}
        title='Saldos'
        titleTypographyProps={{ variant: 'h5' }}
        sx={{ '& .MuiCardHeader-avatar': { mr: 3 } }}
      />
      <CardContent className='flex flex-col gap-5 max-md:gap-5 max-[1015px]:gap-[62px] max-[1051px]:gap-10 max-[1200px]:gap-5 max-[1310px]:gap-10'>
        <div className='flex flex-col sm:flex-row gap-6 p-5 border rounded'>
          {data.map((item, index) => (
            <div key={index} className='flex flex-col gap-2 is-full'>
              <div className='flex items-center gap-2'>
                <CustomAvatar skin='light' variant='rounded' color={item.avatarColor} size={26}>
                  <i className={classnames(item.avatarIcon, 'text-lg')} />
                </CustomAvatar>
                <Typography variant='h6' className='leading-6 font-normal'>
                  {item.title}
                </Typography>
              </div>
              <Typography variant='h4'>{item.stats}</Typography>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default TotaisSaldosCard
