import {
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  Text
} from '@components';
import React from 'react';
import styled from '@styles';

function RadioButtonsGroup() {
  return (
    <FormControl>
      <FormLabel id='demo-radio-buttons-group-label'>Gender</FormLabel>
      <RadioGroup
        aria-labelledby='demo-radio-buttons-group-label'
        defaultValue='female'
        name='radio-buttons-group'
      >
        <FormControlLabel value='female' control={<Radio />} label='Female' />
        <FormControlLabel value='male' control={<Radio />} label='Male' />
        <FormControlLabel value='other' control={<Radio />} label='Other' />
      </RadioGroup>
    </FormControl>
  );
}

function RowRadioButtonsGroup() {
  return (
    <FormControl>
      <FormLabel id='demo-row-radio-buttons-group-label'>Gender</FormLabel>
      <RadioGroup
        row
        aria-labelledby='demo-row-radio-buttons-group-label'
        name='row-radio-buttons-group'
      >
        <FormControlLabel value='female' control={<Radio />} label='Female' />
        <FormControlLabel value='male' control={<Radio />} label='Male' />
        <FormControlLabel value='other' control={<Radio />} label='Other' />
        <FormControlLabel value='disabled' disabled control={<Radio />} label='other' />
      </RadioGroup>
    </FormControl>
  );
}

function ControlledRadioButtonsGroup() {
  const [value, setValue] = React.useState('female');

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <FormControl>
      <FormLabel id='demo-controlled-radio-buttons-group'>Gender</FormLabel>
      <RadioGroup
        aria-labelledby='demo-controlled-radio-buttons-group'
        name='controlled-radio-buttons-group'
        value={value}
        onChange={handleChange}
      >
        <FormControlLabel value='female' control={<Radio />} label='Female' />
        <FormControlLabel value='male' control={<Radio />} label='Male' />
      </RadioGroup>
    </FormControl>
  );
}

function RadioButtons() {
  const [selectedValue, setSelectedValue] = React.useState('a');

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  return (
    <div>
      <Radio
        checked={selectedValue === 'a'}
        onChange={handleChange}
        value='a'
        name='radio-buttons'
        inputProps={{ 'aria-label': 'A' }}
      />
      <Radio
        checked={selectedValue === 'b'}
        onChange={handleChange}
        value='b'
        name='radio-buttons'
        inputProps={{ 'aria-label': 'B' }}
      />
    </div>
  );
}

function SizeRadioButtons() {
  const [selectedValue, setSelectedValue] = React.useState('a');
  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  const controlProps = (item) => ({
    checked: selectedValue === item,
    onChange: handleChange,
    value: item,
    name: 'size-radio-button-demo',
    inputProps: { 'aria-label': item }
  });

  return (
    <div>
      <Radio {...controlProps('a')} size='small' />
      <Radio {...controlProps('b')} />
      <Radio
        {...controlProps('c')}
        css={{
          '& .Icon-Root': {
            fontSize: 28
          }
        }}
      />
    </div>
  );
}

function ColorRadioButtons() {
  const [selectedValue, setSelectedValue] = React.useState('a');

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  const controlProps = (item) => ({
    checked: selectedValue === item,
    onChange: handleChange,
    value: item,
    name: 'color-radio-button-demo',
    inputProps: { 'aria-label': item }
  });

  return (
    <div>
      <Radio {...controlProps('a')} />
      <Radio {...controlProps('b')} color='secondary' />
      <Radio {...controlProps('c')} color='success' />
      <Radio {...controlProps('d')} color='default' />
      <Radio
        {...controlProps('e')}
        css={{
          color: 'pink',
          '&.Radio-Checked': {
            color: 'pink'
          }
        }}
      />
    </div>
  );
}

function FormControlLabelPlacement() {
  return (
    <FormControl>
      <FormLabel id='demo-form-control-label-placement'>Label placement</FormLabel>
      <RadioGroup
        row
        aria-labelledby='demo-form-control-label-placement'
        name='position'
        defaultValue='top'
      >
        <FormControlLabel value='top' control={<Radio />} label='Top' labelPlacement='top' />
        <FormControlLabel value='start' control={<Radio />} label='Start' labelPlacement='start' />
        <FormControlLabel
          value='bottom'
          control={<Radio />}
          label='Bottom'
          labelPlacement='bottom'
        />
        <FormControlLabel value='end' control={<Radio />} label='End' />
      </RadioGroup>
    </FormControl>
  );
}

function ErrorRadios() {
  const [value, setValue] = React.useState('');
  const [error, setError] = React.useState(false);
  const [helperText, setHelperText] = React.useState('Choose wisely');

  const handleRadioChange = (event) => {
    setValue(event.target.value);
    setHelperText(' ');
    setError(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (value === 'best') {
      setHelperText('You got it!');
      setError(false);
    } else if (value === 'worst') {
      setHelperText('Sorry, wrong answer!');
      setError(true);
    } else {
      setHelperText('Please select an option.');
      setError(true);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormControl css={{ margin: '1.5rem' }} error={error} variant='standard'>
        <FormLabel id='demo-error-radios'>Pop quiz: Drew is...</FormLabel>
        <RadioGroup
          aria-labelledby='demo-error-radios'
          name='quiz'
          value={value}
          onChange={handleRadioChange}
        >
          <FormControlLabel value='best' control={<Radio />} label='The best!' />
          <FormControlLabel value='worst' control={<Radio />} label='The worst.' />
        </RadioGroup>
        <FormHelperText>{helperText}</FormHelperText>
        <Button css={{ marginTop: '.5rem', marginRight: '.5rem' }} type='submit' variant='outlined'>
          Check Answer
        </Button>
      </FormControl>
    </form>
  );
}

const BpIcon = styled('span')(({ theme }) => ({
  borderRadius: '50%',
  width: 16,
  height: 16,
  boxShadow:
    theme.color.mode === 'dark'
      ? '0 0 0 1px rgb(16 22 26 / 40%)'
      : 'inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)',
  backgroundColor: theme.color.mode === 'dark' ? '#394b59' : '#f5f8fa',
  backgroundImage:
    theme.color.mode === 'dark'
      ? 'linear-gradient(180deg,hsla(0,0%,100%,.05),hsla(0,0%,100%,0))'
      : 'linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))',
  '.Icon-focusVisible &': {
    outline: '2px auto rgba(19,124,189,.6)',
    outlineOffset: 2
  },
  'input:hover ~ &': {
    backgroundColor: theme.color.mode === 'dark' ? '#30404d' : '#ebf1f5'
  },
  'input:disabled ~ &': {
    boxShadow: 'none',
    background: theme.color.mode === 'dark' ? 'rgba(57,75,89,.5)' : 'rgba(206,217,224,.5)'
  }
}));

const BpCheckedIcon = styled(BpIcon)({
  backgroundColor: '#137cbd',
  backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))',
  '&:before': {
    display: 'block',
    width: 16,
    height: 16,
    backgroundImage: 'radial-gradient(#fff,#fff 28%,transparent 32%)',
    content: '""'
  },
  'input:hover ~ &': {
    backgroundColor: '#106ba3'
  }
});

function BpRadio(props) {
  return (
    <Radio
      disableRipple
      color='default'
      checkedIcon={<BpCheckedIcon />}
      icon={<BpIcon />}
      {...props}
    />
  );
}

function CustomizedRadios() {
  return (
    <FormControl>
      <FormLabel id='demo-customized-radios'>Gender</FormLabel>
      <RadioGroup
        defaultValue='female'
        aria-labelledby='demo-customized-radios'
        name='customized-radios'
      >
        <FormControlLabel value='female' control={<BpRadio />} label='Female' />
        <FormControlLabel value='male' control={<BpRadio />} label='Male' />
        <FormControlLabel value='other' control={<BpRadio />} label='Other' />
        <FormControlLabel
          value='disabled'
          disabled
          control={<BpRadio />}
          label='(Disabled option)'
        />
      </RadioGroup>
    </FormControl>
  );
}

export default function RadioDemo() {
  return (
    <Stack spacing={5} direction='column'>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Radio Button Group</Text>
        <RadioButtonsGroup />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Direction</Text>
        <RowRadioButtonsGroup />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Controlled</Text>
        <ControlledRadioButtonsGroup />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Stand Alone Radio Buttons</Text>
        <RadioButtons />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Size</Text>
        <SizeRadioButtons />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Color</Text>
        <ColorRadioButtons />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Label Placement</Text>
        <FormControlLabelPlacement />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Show Error</Text>
        <ErrorRadios />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Customization</Text>
        <CustomizedRadios />
      </Stack>
    </Stack>
  );
}
