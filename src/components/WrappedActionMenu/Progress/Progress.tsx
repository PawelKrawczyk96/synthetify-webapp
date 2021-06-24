import React from 'react'
import { CircularProgress, Grid, Typography } from '@material-ui/core'
import { Done, Close } from '@material-ui/icons'
import useStyles from './style'

export type ProgressState = 'progress' | 'success' | 'failed'

export interface IProps {
  state: ProgressState
  message: string
}

export const Progress: React.FC<IProps> = ({ state, message }) => {
  const classes = useStyles()

  const progressIcon = (state: ProgressState) => {
    if (state === 'success') {
      return <Done className={classes.success} />
    } else if (state === 'failed') {
      return <Close className={classes.failed} />
    }
    return (
      <Grid className={classes.progress}>
        <CircularProgress />
      </Grid>
    )
  }

  return (
    <Typography>
      <Grid container direction='row' alignItems='center' style={{ minHeight: 52 }}>
        <Grid item style={{ paddingRight: 10, minWidth: 42 }}>
          {progressIcon(state)}
        </Grid>
        <Grid item className={classes.text}>
          {message}
        </Grid>
      </Grid>
    </Typography>
  )
}
