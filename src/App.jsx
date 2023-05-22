import * as React from 'react';
import { ButtonBase, Box, Paper, Text, Grid } from '@components';
import Avatar from '@mui/material/Avatar';
import { createBreakpoints } from '@components/lib';
import styled from '@emotion/styled';

const Img = styled('img')({
  margin: 'auto',
  display: 'block',
  maxWidth: '100%',
  maxHeight: '100%'
});

export default function ComplexGrid() {
  return (
    <Paper
      css={{
        padding: 16,
        margin: 'auto',
        marginTop: 32,
        maxWidth: 500,
        flexGrow: 1,
        backgroundColor: '#fff'
      }}
    >
      <Grid container spacing={2}>
        <Grid>
          <ButtonBase css={{ width: 128, height: 128 }}>
            <Img alt='complex' src='/static/images/grid/complex.jpg' />
          </ButtonBase>
        </Grid>
        <Grid xs={12} sm container>
          <Grid xs container direction='column' spacing={2}>
            <Grid xs>
              <Text
                className='text-black'
                gutterBottom
                variant='subtitle1'
                component='div'
              >
                Standard license
              </Text>
              <Text className='text-black' variant='body2' gutterBottom>
                Full resolution 1920x1080 • JPEG
              </Text>
              <Text
                className='text-black'
                variant='body2'
                color='text.secondary'
              >
                ID: 1030114
              </Text>
            </Grid>
            <Grid>
              <Text
                className='text-black'
                css={{ cursor: 'pointer' }}
                variant='body2'
              >
                Remove
              </Text>
            </Grid>
          </Grid>
          <Grid>
            <Text className='text-black' variant='subtitle1' component='div'>
              $19.00
            </Text>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}
