import React from 'react';
import { Box, TextField } from '@components';

export default function BasicTextFields() {
  return (
    <Box
      component='form'
      css={{
        '& > :not(style)': { margin: '.5rem', width: '25ch' }
      }}
      noValidate
      autoComplete='off'
    >
      <TextField id='outlined-basic' label='Outlined' variant='outlined' />
      <TextField id='filled-basic' label='Filled' variant='filled' />
      <TextField id='standard-basic' label='Standard' variant='standard' />
    </Box>
  );
}
