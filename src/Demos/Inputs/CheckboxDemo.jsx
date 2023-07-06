import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
  Icon,
  Stack,
  Text
} from '@components';
import React from 'react';
import styled from '@styles';

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

function Checkboxes() {
  return (
    <div>
      <Checkbox {...label} defaultChecked />
      <Checkbox {...label} />
      <Checkbox {...label} disabled />
      <Checkbox {...label} disabled checked />
    </div>
  );
}

function CheckboxLabels() {
  return (
    <FormGroup>
      <FormControlLabel control={<Checkbox defaultChecked />} label='Label' />
      <FormControlLabel required control={<Checkbox />} label='Required' />
      <FormControlLabel disabled control={<Checkbox />} label='Disabled' />
    </FormGroup>
  );
}

function SizeCheckboxes() {
  return (
    <div>
      <Checkbox {...label} defaultChecked size='small' />
      <Checkbox {...label} defaultChecked />
      <Checkbox {...label} defaultChecked sx={{ '& .SvgIcon-Root': { fontSize: 28 } }} />
    </div>
  );
}

function ColorCheckboxes() {
  return (
    <div>
      <Checkbox {...label} defaultChecked />
      <Checkbox {...label} defaultChecked color='secondary' />
      <Checkbox {...label} defaultChecked color='success' />
      <Checkbox {...label} defaultChecked color='default' />
      <Checkbox
        {...label}
        defaultChecked
        sx={{
          color: 'pink',
          '&.Checked': {
            color: 'pink'
          }
        }}
      />
    </div>
  );
}

function IconCheckboxes() {
  return (
    <div>
      <Checkbox
        {...label}
        icon={<Icon icon='MdFavoriteBorder' />}
        checkedIcon={<Icon icon='MdFavorite' />}
      />
      <Checkbox
        {...label}
        icon={<Icon icon='MdBookmarkBorder' />}
        checkedIcon={<Icon icon='MdBookmark' />}
      />
    </div>
  );
}

function ControlledCheckbox() {
  const [checked, setChecked] = React.useState(true);

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  return (
    <Checkbox
      checked={checked}
      onChange={handleChange}
      inputProps={{ 'aria-label': 'controlled' }}
    />
  );
}

function IndeterminateCheckbox() {
  const [checked, setChecked] = React.useState([true, false]);

  const handleChange1 = (event) => {
    setChecked([event.target.checked, event.target.checked]);
  };

  const handleChange2 = (event) => {
    setChecked([event.target.checked, checked[1]]);
  };

  const handleChange3 = (event) => {
    setChecked([checked[0], event.target.checked]);
  };

  const children = (
    <Box sx={{ display: 'flex', flexDirection: 'column', ml: 3 }}>
      <FormControlLabel
        label='Child 1'
        control={<Checkbox checked={checked[0]} onChange={handleChange2} />}
      />
      <FormControlLabel
        label='Child 2'
        control={<Checkbox checked={checked[1]} onChange={handleChange3} />}
      />
    </Box>
  );

  return (
    <div>
      <FormControlLabel
        label='Parent'
        control={
          <Checkbox
            checked={checked[0] && checked[1]}
            indeterminate={checked[0] !== checked[1]}
            onChange={handleChange1}
          />
        }
      />
      {children}
    </div>
  );
}

function CheckboxesGroup() {
  const [state, setState] = React.useState({
    gilad: true,
    jason: false,
    antoine: false
  });

  const handleChange = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.checked
    });
  };

  const { gilad, jason, antoine } = state;
  const error = [gilad, jason, antoine].filter((v) => v).length !== 2;

  return (
    <Box sx={{ display: 'flex' }}>
      <FormControl sx={{ m: 3 }} component='fieldset' variant='standard'>
        <FormLabel component='legend'>Assign responsibility</FormLabel>
        <FormGroup>
          <FormControlLabel
            control={<Checkbox checked={gilad} onChange={handleChange} name='gilad' />}
            label='Gilad Gray'
          />
          <FormControlLabel
            control={<Checkbox checked={jason} onChange={handleChange} name='jason' />}
            label='Jason Killian'
          />
          <FormControlLabel
            control={<Checkbox checked={antoine} onChange={handleChange} name='antoine' />}
            label='Antoine Llorca'
          />
        </FormGroup>
        <FormHelperText>Be careful</FormHelperText>
      </FormControl>
      <FormControl required error={error} component='fieldset' sx={{ m: 3 }} variant='standard'>
        <FormLabel component='legend'>Pick two</FormLabel>
        <FormGroup>
          <FormControlLabel
            control={<Checkbox checked={gilad} onChange={handleChange} name='gilad' />}
            label='Gilad Gray'
          />
          <FormControlLabel
            control={<Checkbox checked={jason} onChange={handleChange} name='jason' />}
            label='Jason Killian'
          />
          <FormControlLabel
            control={<Checkbox checked={antoine} onChange={handleChange} name='antoine' />}
            label='Antoine Llorca'
          />
        </FormGroup>
        <FormHelperText>You can display an error</FormHelperText>
      </FormControl>
    </Box>
  );
}

function FormControlLabelPosition() {
  return (
    <FormControl component='fieldset'>
      <FormLabel component='legend'>Label placement</FormLabel>
      <FormGroup aria-label='position' row>
        <FormControlLabel value='top' control={<Checkbox />} label='Top' labelPlacement='top' />
        <FormControlLabel
          value='start'
          control={<Checkbox />}
          label='Start'
          labelPlacement='start'
        />
        <FormControlLabel
          value='bottom'
          control={<Checkbox />}
          label='Bottom'
          labelPlacement='bottom'
        />
        <FormControlLabel value='end' control={<Checkbox />} label='End' labelPlacement='end' />
      </FormGroup>
    </FormControl>
  );
}

const BpIcon = styled('span')(({ theme }) => ({
  borderRadius: 3,
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
  '.FocusVisible &': {
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
    backgroundImage:
      "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath" +
      " fill-rule='evenodd' clip-rule='evenodd' d='M12 5c-.28 0-.53.11-.71.29L7 9.59l-2.29-2.3a1.003 " +
      "1.003 0 00-1.42 1.42l3 3c.18.18.43.29.71.29s.53-.11.71-.29l5-5A1.003 1.003 0 0012 5z' fill='%23fff'/%3E%3C/svg%3E\")",
    content: '""'
  },
  'input:hover ~ &': {
    backgroundColor: '#106ba3'
  }
});

// Inspired by blueprintjs
function BpCheckbox(props) {
  return (
    <Checkbox
      css={{
        '&:hover': { bgcolor: 'transparent' }
      }}
      disableRipple
      color='default'
      checkedIcon={<BpCheckedIcon />}
      icon={<BpIcon />}
      inputProps={{ 'aria-label': 'Checkbox demo' }}
      {...props}
    />
  );
}

function CustomizedCheckbox() {
  return (
    <div>
      <BpCheckbox />
      <BpCheckbox defaultChecked />
      <BpCheckbox disabled />
    </div>
  );
}

export default function CheckboxDemo() {
  return (
    <Stack spacing={5} direction='column'>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Basic Checkboxes</Text>
        <Checkboxes />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Labeled Checkboxes</Text>
        <CheckboxLabels />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Checkbox Sizes</Text>
        <SizeCheckboxes />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Checkbox Colors</Text>
        <ColorCheckboxes />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Icon Checkboxes</Text>
        <IconCheckboxes />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Controlled Checkbox</Text>
        <ControlledCheckbox />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Indeterminate Checkboxes</Text>
        <IndeterminateCheckbox />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>FormGroup Checkboxes</Text>
        <CheckboxesGroup />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Label Placement Checkboxes</Text>
        <FormControlLabelPosition />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Customized Checkboxes</Text>
        <CustomizedCheckbox />
      </Stack>
    </Stack>
  );
}
