import { Stack, Box, TextField } from '@components';

function BasicTextFields() {
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

function FormPropsTextFields() {
  return (
    <Box component='form' noValidate autoComplete='off'>
      <Stack direction='row' spacing={1}>
        <TextField required id='outlined-required' label='Required' defaultValue='Hello World' />
        <TextField disabled id='outlined-disabled' label='Disabled' defaultValue='Hello World' />
        <TextField
          id='outlined-password-input'
          label='Password'
          type='password'
          autoComplete='current-password'
        />
        <TextField
          id='outlined-read-only-input'
          label='Read Only'
          defaultValue='Hello World'
          InputProps={{
            readOnly: true
          }}
        />
        <TextField
          id='outlined-number'
          label='Number'
          type='number'
          InputLabelProps={{
            shrink: true
          }}
        />
        <TextField id='outlined-search' label='Search field' type='search' />
        <TextField
          id='outlined-helperText'
          label='Helper text'
          defaultValue='Default Value'
          helperText='Some important text'
        />
      </Stack>
      <Stack direction='row' spacing={1}>
        <TextField
          required
          id='filled-required'
          label='Required'
          defaultValue='Hello World'
          variant='filled'
        />
        <TextField
          disabled
          id='filled-disabled'
          label='Disabled'
          defaultValue='Hello World'
          variant='filled'
        />
        <TextField
          id='filled-password-input'
          label='Password'
          type='password'
          autoComplete='current-password'
          variant='filled'
        />
        <TextField
          id='filled-read-only-input'
          label='Read Only'
          defaultValue='Hello World'
          InputProps={{
            readOnly: true
          }}
          variant='filled'
        />
        <TextField
          id='filled-number'
          label='Number'
          type='number'
          InputLabelProps={{
            shrink: true
          }}
          variant='filled'
        />
        <TextField id='filled-search' label='Search field' type='search' variant='filled' />
        <TextField
          id='filled-helperText'
          label='Helper text'
          defaultValue='Default Value'
          helperText='Some important text'
          variant='filled'
        />
      </Stack>
      <Stack direction='row' spacing={1}>
        <TextField
          required
          id='standard-required'
          label='Required'
          defaultValue='Hello World'
          variant='standard'
        />
        <TextField
          disabled
          id='standard-disabled'
          label='Disabled'
          defaultValue='Hello World'
          variant='standard'
        />
        <TextField
          id='standard-password-input'
          label='Password'
          type='password'
          autoComplete='current-password'
          variant='standard'
        />
        <TextField
          id='standard-read-only-input'
          label='Read Only'
          defaultValue='Hello World'
          InputProps={{
            readOnly: true
          }}
          variant='standard'
        />
        <TextField
          id='standard-number'
          label='Number'
          type='number'
          InputLabelProps={{
            shrink: true
          }}
          variant='standard'
        />
        <TextField id='standard-search' label='Search field' type='search' variant='standard' />
        <TextField
          id='standard-helperText'
          label='Helper text'
          defaultValue='Default Value'
          helperText='Some important text'
          variant='standard'
        />
      </Stack>
    </Box>
  );
}

export default function TextFieldDemo() {
  return (
    <Stack spacing={5} direction='column'>
      <BasicTextFields />
      <FormPropsTextFields />
    </Stack>
  );
}
