// MUI Imports
import Grid from '@mui/material/Grid'

// Component Imports
import PreviewActions from './PreviewActions'
import PreviewCard from './PreviewCard'

const Preview = () => {
  return (
    <>
      <Grid container spacing={6}>
        <Grid item xs={12} md={12}>
          <PreviewCard />
        </Grid>
        <Grid item xs={12} md={12}>
          <PreviewActions />
        </Grid>
      </Grid>
    </>
  )
}

export default Preview
