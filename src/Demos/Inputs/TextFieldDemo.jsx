import React from 'react';
import styled from '@styles';
import {
  Stack,
  Box,
  FilledInput,
  FormControl,
  FormHelperText,
  Icon,
  IconButton,
  Input,
  InputAdornment,
  InputBase,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Text,
  TextField
} from '@components';

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
          slotProps={{
            input: {
              readOnly: true
            }
          }}
        />
        <TextField
          id='outlined-number'
          label='Number'
          type='number'
          slotProps={{
            inputLabel: {
              shrink: true
            }
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
          slotProps={{
            input: {
              readOnly: true
            }
          }}
          variant='filled'
        />
        <TextField
          id='filled-number'
          label='Number'
          type='number'
          slotProps={{
            inputLabel: {
              shrink: true
            }
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
          slotProps={{
            input: {
              readOnly: true
            }
          }}
          variant='standard'
        />
        <TextField
          id='standard-number'
          label='Number'
          type='number'
          slotProps={{
            inputLabel: {
              shrink: true
            }
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

function ValidationTextFields() {
  return (
    <Box
      component='form'
      sx={{
        '& .TextField-Root': { m: 1, width: '25ch' }
      }}
      noValidate
      autoComplete='off'
    >
      <div>
        <TextField error id='outlined-error' label='Error' defaultValue='Hello World' />
        <TextField
          error
          id='outlined-error-helper-text'
          label='Error'
          defaultValue='Hello World'
          helperText='Incorrect entry.'
        />
      </div>
      <div>
        <TextField
          error
          id='filled-error'
          label='Error'
          defaultValue='Hello World'
          variant='filled'
        />
        <TextField
          error
          id='filled-error-helper-text'
          label='Error'
          defaultValue='Hello World'
          helperText='Incorrect entry.'
          variant='filled'
        />
      </div>
      <div>
        <TextField
          error
          id='standard-error'
          label='Error'
          defaultValue='Hello World'
          variant='standard'
        />
        <TextField
          error
          id='standard-error-helper-text'
          label='Error'
          defaultValue='Hello World'
          helperText='Incorrect entry.'
          variant='standard'
        />
      </div>
    </Box>
  );
}

function MultilineTextFields() {
  return (
    <Box
      component='form'
      sx={{
        '& .TextField-Root': { m: 1, width: '25ch' }
      }}
      noValidate
      autoComplete='off'
    >
      <div>
        <TextField id='outlined-multiline-flexible' label='Multiline' multiline maxRows={4} />
        <TextField
          id='outlined-textarea'
          label='Multiline Placeholder'
          placeholder='Placeholder'
          multiline
        />
        <TextField
          id='outlined-multiline-static'
          label='Multiline'
          multiline
          rows={4}
          defaultValue='Default Value'
        />
      </div>
      <div>
        <TextField
          id='filled-multiline-flexible'
          label='Multiline'
          multiline
          maxRows={4}
          variant='filled'
        />
        <TextField
          id='filled-textarea'
          label='Multiline Placeholder'
          placeholder='Placeholder'
          multiline
          variant='filled'
        />
        <TextField
          id='filled-multiline-static'
          label='Multiline'
          multiline
          rows={4}
          defaultValue='Default Value'
          variant='filled'
        />
      </div>
      <div>
        <TextField
          id='standard-multiline-flexible'
          label='Multiline'
          multiline
          maxRows={4}
          variant='standard'
        />
        <TextField
          id='standard-textarea'
          label='Multiline Placeholder'
          placeholder='Placeholder'
          multiline
          variant='standard'
        />
        <TextField
          id='standard-multiline-static'
          label='Multiline'
          multiline
          rows={4}
          defaultValue='Default Value'
          variant='standard'
        />
      </div>
    </Box>
  );
}

const currencies = [
  {
    value: 'USD',
    label: '$'
  },
  {
    value: 'EUR',
    label: '€'
  },
  {
    value: 'BTC',
    label: '฿'
  },
  {
    value: 'JPY',
    label: '¥'
  }
];

function SelectTextFields() {
  return (
    <Box
      component='form'
      sx={{
        '& .TextField-Root': { m: 1, width: '25ch' }
      }}
      noValidate
      autoComplete='off'
    >
      <div>
        <TextField
          id='outlined-select-currency'
          select
          label='Select'
          defaultValue='EUR'
          helperText='Please select your currency'
        >
          {currencies.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          id='outlined-select-currency-native'
          select
          label='Native select'
          defaultValue='EUR'
          slotProps={{
            select: {
              native: true
            }
          }}
          helperText='Please select your currency'
        >
          {currencies.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </TextField>
      </div>
      <div>
        <TextField
          id='filled-select-currency'
          select
          label='Select'
          defaultValue='EUR'
          helperText='Please select your currency'
          variant='filled'
        >
          {currencies.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          id='filled-select-currency-native'
          select
          label='Native select'
          defaultValue='EUR'
          slotProps={{
            select: {
              native: true
            }
          }}
          helperText='Please select your currency'
          variant='filled'
        >
          {currencies.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </TextField>
      </div>
      <div>
        <TextField
          id='standard-select-currency'
          select
          label='Select'
          defaultValue='EUR'
          helperText='Please select your currency'
          variant='standard'
        >
          {currencies.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          id='standard-select-currency-native'
          select
          label='Native select'
          defaultValue='EUR'
          slotProps={{
            select: {
              native: true
            }
          }}
          helperText='Please select your currency'
          variant='standard'
        >
          {currencies.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </TextField>
      </div>
    </Box>
  );
}

function InputWithIcon() {
  return (
    <Box sx={{ '& > :not(style)': { m: 1 } }}>
      <FormControl variant='standard'>
        <InputLabel htmlFor='input-with-icon-adornment'>With a start adornment</InputLabel>
        <Input
          id='input-with-icon-adornment'
          startAdornment={
            <InputAdornment position='start'>
              <Icon icon='MdAccountCircle' />
            </InputAdornment>
          }
        />
      </FormControl>
      <TextField
        id='input-with-icon-textfield'
        label='TextField'
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position='start'>
                <Icon icon='MdAccountCircle' />
              </InputAdornment>
            )
          }
        }}
        variant='standard'
      />
      <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
        <Icon icon='MdAccountCircle' sx={{ color: 'active', mr: 1, my: 0.5 }} />
        <TextField id='input-with-sx' label='With sx' variant='standard' />
      </Box>
    </Box>
  );
}

function InputAdornments() {
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
      <div>
        <TextField
          label='With normal TextField'
          id='outlined-start-adornment'
          sx={{ m: 1, width: '25ch' }}
          slotProps={{
            input: {
              startAdornment: <InputAdornment position='start'>kg</InputAdornment>
            }
          }}
        />
        <FormControl sx={{ m: 1, width: '25ch' }} variant='outlined'>
          <OutlinedInput
            id='outlined-adornment-weight'
            endAdornment={<InputAdornment position='end'>kg</InputAdornment>}
            aria-describedby='outlined-weight-helper-text'
            inputProps={{
              'aria-label': 'weight'
            }}
          />
          <FormHelperText id='outlined-weight-helper-text'>Weight</FormHelperText>
        </FormControl>
        <FormControl sx={{ m: 1, width: '25ch' }} variant='outlined'>
          <InputLabel htmlFor='outlined-adornment-password'>Password</InputLabel>
          <OutlinedInput
            id='outlined-adornment-password'
            type={showPassword ? 'text' : 'password'}
            endAdornment={
              <InputAdornment position='end'>
                <IconButton
                  aria-label='toggle password visibility'
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge='end'
                >
                  {showPassword ? <Icon icon='MdVisibilityOff' /> : <Icon icon='MdVisibility' />}
                </IconButton>
              </InputAdornment>
            }
            label='Password'
          />
        </FormControl>
        <FormControl fullWidth sx={{ m: 1 }}>
          <InputLabel htmlFor='outlined-adornment-amount'>Amount</InputLabel>
          <OutlinedInput
            id='outlined-adornment-amount'
            startAdornment={<InputAdornment position='start'>$</InputAdornment>}
            label='Amount'
          />
        </FormControl>
      </div>
      <div>
        <TextField
          label='With normal TextField'
          id='filled-start-adornment'
          sx={{ m: 1, width: '25ch' }}
          slotProps={{
            input: {
              startAdornment: <InputAdornment position='start'>kg</InputAdornment>
            }
          }}
          variant='filled'
        />
        <FormControl sx={{ m: 1, width: '25ch' }} variant='filled'>
          <FilledInput
            id='filled-adornment-weight'
            endAdornment={<InputAdornment position='end'>kg</InputAdornment>}
            aria-describedby='filled-weight-helper-text'
            inputProps={{
              'aria-label': 'weight'
            }}
          />
          <FormHelperText id='filled-weight-helper-text'>Weight</FormHelperText>
        </FormControl>
        <FormControl sx={{ m: 1, width: '25ch' }} variant='filled'>
          <InputLabel htmlFor='filled-adornment-password'>Password</InputLabel>
          <FilledInput
            id='filled-adornment-password'
            type={showPassword ? 'text' : 'password'}
            endAdornment={
              <InputAdornment position='end'>
                <IconButton
                  aria-label='toggle password visibility'
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge='end'
                >
                  {showPassword ? <Icon icon='MdVisibilityOff' /> : <Icon icon='MdVisibility' />}
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>
        <FormControl fullWidth sx={{ m: 1 }} variant='filled'>
          <InputLabel htmlFor='filled-adornment-amount'>Amount</InputLabel>
          <FilledInput
            id='filled-adornment-amount'
            startAdornment={<InputAdornment position='start'>$</InputAdornment>}
          />
        </FormControl>
      </div>
      <div>
        <TextField
          label='With normal TextField'
          id='standard-start-adornment'
          sx={{ m: 1, width: '25ch' }}
          slotProps={{
            input: {
              startAdornment: <InputAdornment position='start'>kg</InputAdornment>
            }
          }}
          variant='standard'
        />
        <FormControl variant='standard' sx={{ m: 1, mt: 3, width: '25ch' }}>
          <Input
            id='standard-adornment-weight'
            endAdornment={<InputAdornment position='end'>kg</InputAdornment>}
            aria-describedby='standard-weight-helper-text'
            inputProps={{
              'aria-label': 'weight'
            }}
          />
          <FormHelperText id='standard-weight-helper-text'>Weight</FormHelperText>
        </FormControl>
        <FormControl sx={{ m: 1, width: '25ch' }} variant='standard'>
          <InputLabel htmlFor='standard-adornment-password'>Password</InputLabel>
          <Input
            id='standard-adornment-password'
            type={showPassword ? 'text' : 'password'}
            endAdornment={
              <InputAdornment position='end'>
                <IconButton
                  aria-label='toggle password visibility'
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                >
                  {showPassword ? <Icon icon='MdVisibilityOff' /> : <Icon icon='MdVisibility' />}
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>
        <FormControl fullWidth sx={{ m: 1 }} variant='standard'>
          <InputLabel htmlFor='standard-adornment-amount'>Amount</InputLabel>
          <Input
            id='standard-adornment-amount'
            startAdornment={<InputAdornment position='start'>$</InputAdornment>}
          />
        </FormControl>
      </div>
    </Box>
  );
}

function TextFieldSizes() {
  return (
    <Box
      component='form'
      sx={{
        '& .TextField-Root': { m: 1, width: '25ch' }
      }}
      noValidate
      autoComplete='off'
    >
      <div>
        <TextField label='Size' id='outlined-size-small' defaultValue='Small' size='small' />
        <TextField label='Size' id='outlined-size-normal' defaultValue='Normal' />
      </div>
      <div>
        <TextField
          label='Size'
          id='filled-size-small'
          defaultValue='Small'
          variant='filled'
          size='small'
        />
        <TextField label='Size' id='filled-size-normal' defaultValue='Normal' variant='filled' />
      </div>
      <div>
        <TextField
          label='Size'
          id='standard-size-small'
          defaultValue='Small'
          size='small'
          variant='standard'
        />
        <TextField
          label='Size'
          id='standard-size-normal'
          defaultValue='Normal'
          variant='standard'
        />
      </div>
    </Box>
  );
}

function TextFieldHiddenLabel() {
  return (
    <Stack
      component='form'
      sx={{
        width: '25ch'
      }}
      spacing={2}
      noValidate
      autoComplete='off'
    >
      <TextField
        hiddenLabel
        id='filled-hidden-label-small'
        defaultValue='Small'
        variant='filled'
        size='small'
      />
      <TextField
        hiddenLabel
        id='filled-hidden-label-normal'
        defaultValue='Normal'
        variant='filled'
      />
    </Stack>
  );
}

function RedBar() {
  return (
    <Box
      sx={{
        height: 20,
        backgroundColor: (theme) =>
          theme.color.mode === 'light' ? 'rgba(255, 0, 0, 0.1)' : 'rgb(255 132 132 / 25%)'
      }}
    />
  );
}

function LayoutTextFields() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        '& .TextField-Root': { width: '25ch' }
      }}
    >
      <RedBar />
      <TextField label={'margin="none"'} id='margin-none' />
      <RedBar />
      <TextField label={'margin="dense"'} id='margin-dense' margin='dense' />
      <RedBar />
      <TextField label={'margin="normal"'} id='margin-normal' margin='normal' />
      <RedBar />
    </Box>
  );
}

function FullWidthTextField() {
  return (
    <Box
      sx={{
        width: 500,
        maxWidth: '100%'
      }}
    >
      <TextField fullWidth label='fullWidth' id='fullWidth' />
    </Box>
  );
}

function StateTextFields() {
  const [name, setName] = React.useState('Cat in the Hat');

  return (
    <Box
      component='form'
      sx={{
        '& > :not(style)': { m: 1, width: '25ch' }
      }}
      noValidate
      autoComplete='off'
    >
      <TextField
        id='outlined-controlled'
        label='Controlled'
        value={name}
        onChange={(event) => {
          setName(event.target.value);
        }}
      />
      <TextField id='outlined-uncontrolled' label='Uncontrolled' defaultValue='foo' />
    </Box>
  );
}

function ComposedTextField() {
  return (
    <Box
      component='form'
      sx={{
        '& > :not(style)': { m: 1 }
      }}
      noValidate
      autoComplete='off'
    >
      <FormControl variant='standard'>
        <InputLabel htmlFor='component-simple'>Name</InputLabel>
        <Input id='component-simple' defaultValue='Composed TextField' />
      </FormControl>
      <FormControl variant='standard'>
        <InputLabel htmlFor='component-helper'>Name</InputLabel>
        <Input
          id='component-helper'
          defaultValue='Composed TextField'
          aria-describedby='component-helper-text'
        />
        <FormHelperText id='component-helper-text'>Some important helper text</FormHelperText>
      </FormControl>
      <FormControl disabled variant='standard'>
        <InputLabel htmlFor='component-disabled'>Name</InputLabel>
        <Input id='component-disabled' defaultValue='Composed TextField' />
        <FormHelperText>Disabled</FormHelperText>
      </FormControl>
      <FormControl error variant='standard'>
        <InputLabel htmlFor='component-error'>Name</InputLabel>
        <Input
          id='component-error'
          defaultValue='Composed TextField'
          aria-describedby='component-error-text'
        />
        <FormHelperText id='component-error-text'>Error</FormHelperText>
      </FormControl>
      <FormControl>
        <InputLabel htmlFor='component-outlined'>Name</InputLabel>
        <OutlinedInput id='component-outlined' defaultValue='Composed TextField' label='Name' />
      </FormControl>
      <FormControl variant='filled'>
        <InputLabel htmlFor='component-filled'>Name</InputLabel>
        <FilledInput id='component-filled' defaultValue='Composed TextField' />
      </FormControl>
    </Box>
  );
}

const ariaLabel = { 'aria-label': 'description' };

function Inputs() {
  return (
    <Box
      component='form'
      sx={{
        '& > :not(style)': { m: 1 }
      }}
      noValidate
      autoComplete='off'
    >
      <Input defaultValue='Hello world' inputProps={ariaLabel} />
      <Input placeholder='Placeholder' inputProps={ariaLabel} />
      <Input disabled defaultValue='Disabled' inputProps={ariaLabel} />
      <Input defaultValue='Error' error inputProps={ariaLabel} />
    </Box>
  );
}

function ColorTextFields() {
  return (
    <Box
      component='form'
      sx={{
        '& > :not(style)': { m: 1, width: '25ch' }
      }}
      noValidate
      autoComplete='off'
    >
      <TextField label='Outlined secondary' color='secondary' focused />
      <TextField label='Filled success' variant='filled' color='success' focused />
      <TextField label='Standard warning' variant='standard' color='warning' focused />
    </Box>
  );
}

const CssTextField = styled(TextField)({
  '& label.Focused': {
    color: '#A0AAB4'
  },
  '& .Input-underline:after': {
    borderBottomColor: '#B2BAC2'
  },
  '& .OutlinedInput-root': {
    '& fieldset': {
      borderColor: '#E0E3E7'
    },
    '&:hover fieldset': {
      borderColor: '#B2BAC2'
    },
    '&.Focused fieldset': {
      borderColor: '#6F7E8C'
    }
  }
});

const BootstrapInput = styled(InputBase)(({ theme }) => ({
  'Label + &': {
    marginTop: theme.spacing(3)
  },
  '& .InputBase-Input': {
    borderRadius: 4,
    position: 'relative',
    backgroundColor: theme.color.mode === 'light' ? '#F3F6F9' : '#1A2027',
    border: '1px solid',
    borderColor: theme.color.mode === 'light' ? '#E0E3E7' : '#2D3843',
    fontSize: 16,
    width: 'auto',
    padding: '10px 12px',
    transition: theme.transition.create(['border-color', 'background-color', 'box-shadow']),
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"'
    ].join(','),
    '&:focus': {
      boxShadow: `${theme.alpha.add(theme.color.primary.body, 0.25)} 0 0 0 0.2rem`,
      borderColor: theme.color.primary.body
    }
  }
}));

const RedditTextField = styled((props) => (
  <TextField slotProps={{ input: { disableUnderline: true } }} {...props} />
))(({ theme }) => ({
  '& .FilledInput-Root': {
    overflow: 'hidden',
    borderRadius: 4,
    backgroundColor: theme.color.mode === 'light' ? '#F3F6F9' : '#1A2027',
    border: '1px solid',
    borderColor: theme.color.mode === 'light' ? '#E0E3E7' : '#2D3843',
    transition: theme.transition.create(['border-color', 'background-color', 'box-shadow']),
    '&:hover': {
      backgroundColor: 'transparent'
    },
    '&.Focused': {
      backgroundColor: 'transparent',
      boxShadow: `${theme.alpha.add(theme.color.primary.body, 0.25)} 0 0 0 2px`,
      borderColor: theme.color.primary.body
    }
  }
}));

const ValidationTextField = styled(TextField)({
  '& input:valid + fieldset': {
    borderColor: '#E0E3E7',
    borderWidth: 1
  },
  '& input:invalid + fieldset': {
    borderColor: 'red',
    borderWidth: 1
  },
  '& input:valid:focus + fieldset': {
    borderLeftWidth: 4,
    padding: '4px !important'
  }
});

function CustomizedInputsStyled() {
  return (
    <Box
      component='form'
      noValidate
      sx={{
        display: 'grid',
        gridTemplateColumns: { sm: '1fr 1fr' },
        gap: 2
      }}
    >
      <FormControl variant='standard'>
        <InputLabel shrink htmlFor='bootstrap-input'>
          Bootstrap
        </InputLabel>
        <BootstrapInput defaultValue='react-bootstrap' id='bootstrap-input' />
      </FormControl>
      <RedditTextField
        label='Reddit'
        defaultValue='react-reddit'
        id='reddit-input'
        variant='filled'
        style={{ marginTop: 11 }}
      />
      <CssTextField label='Custom CSS' id='custom-css-outlined-input' />
      <ValidationTextField
        label='CSS validation style'
        required
        variant='outlined'
        defaultValue='Success'
        id='validation-outlined-input'
      />
    </Box>
  );
}

export default function TextFieldDemo() {
  return (
    <Stack spacing={5} direction='column'>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Basic TextField</Text>
        <BasicTextFields />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Form Props</Text>
        <FormPropsTextFields />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>TextField Validation</Text>
        <ValidationTextFields />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Multiline Colors</Text>
        <MultilineTextFields />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Select TextField</Text>
        <SelectTextFields />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>TextFields with Icons</Text>
        <InputWithIcon />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>TextField Adornments</Text>
        <InputAdornments />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>TextField Sizes</Text>
        <TextFieldSizes />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>TextField Fill Variant Sizes</Text>
        <TextFieldHiddenLabel />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>TextField Margin Prop</Text>
        <LayoutTextFields />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Full Width TextField</Text>
        <FullWidthTextField />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Uncotrolled vs Controlled TextField</Text>
        <StateTextFields />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Customized TextField Components</Text>
        <ComposedTextField />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Inputs</Text>
        <Inputs />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Colors</Text>
        <ColorTextFields />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Customized TextFields</Text>
        <CustomizedInputsStyled />
      </Stack>
      <Box height={250} width='100%' />
    </Stack>
  );
}
