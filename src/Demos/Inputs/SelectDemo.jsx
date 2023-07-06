import React from 'react';
import styled from '@styles';
import {
  Box,
  Button,
  InputBase,
  InputLabel,
  ListSubheader,
  MenuItem,
  FormControl,
  FormHelperText,
  Select,
  NativeSelect,
  Stack,
  Text
} from '@components';

function BasicSelect() {
  const [age, setAge] = React.useState('');

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id='demo-simple-select-label'>Age</InputLabel>
        <Select
          labelId='demo-simple-select-label'
          id='demo-simple-select'
          value={age}
          label='Age'
          onChange={handleChange}
        >
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}

function SelectVariants() {
  const [age, setAge] = React.useState('');

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  return (
    <div>
      <FormControl variant='standard' sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id='demo-simple-select-standard-label'>Age</InputLabel>
        <Select
          labelId='demo-simple-select-standard-label'
          id='demo-simple-select-standard'
          value={age}
          onChange={handleChange}
          label='Age'
        >
          <MenuItem value=''>
            <em>None</em>
          </MenuItem>
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select>
      </FormControl>
      <FormControl variant='filled' sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id='demo-simple-select-filled-label'>Age</InputLabel>
        <Select
          labelId='demo-simple-select-filled-label'
          id='demo-simple-select-filled'
          value={age}
          onChange={handleChange}
        >
          <MenuItem value=''>
            <em>None</em>
          </MenuItem>
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}

function SelectLabels() {
  const [age, setAge] = React.useState('');

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  return (
    <div>
      <FormControl sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id='demo-simple-select-helper-label'>Age</InputLabel>
        <Select
          labelId='demo-simple-select-helper-label'
          id='demo-simple-select-helper'
          value={age}
          label='Age'
          onChange={handleChange}
        >
          <MenuItem value=''>
            <em>None</em>
          </MenuItem>
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select>
        <FormHelperText>With label + helper text</FormHelperText>
      </FormControl>
      <FormControl sx={{ m: 1, minWidth: 120 }}>
        <Select
          value={age}
          onChange={handleChange}
          displayEmpty
          inputProps={{ 'aria-label': 'Without label' }}
        >
          <MenuItem value=''>
            <em>None</em>
          </MenuItem>
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select>
        <FormHelperText>Without label</FormHelperText>
      </FormControl>
    </div>
  );
}

function SelectAutoWidth() {
  const [age, setAge] = React.useState('');

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  return (
    <div>
      <FormControl sx={{ m: 1, minWidth: 80 }}>
        <InputLabel id='demo-simple-select-autowidth-label'>Age</InputLabel>
        <Select
          labelId='demo-simple-select-autowidth-label'
          id='demo-simple-select-autowidth'
          value={age}
          onChange={handleChange}
          autoWidth
          label='Age'
        >
          <MenuItem value=''>
            <em>None</em>
          </MenuItem>
          <MenuItem value={10}>Twenty</MenuItem>
          <MenuItem value={21}>Twenty one</MenuItem>
          <MenuItem value={22}>Twenty one and a half</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}

function SelectSmall() {
  const [age, setAge] = React.useState('');

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  return (
    <FormControl sx={{ m: 1, minWidth: 120 }} size='small'>
      <InputLabel id='demo-select-small-label'>Age</InputLabel>
      <Select
        labelId='demo-select-small-label'
        id='demo-select-small'
        value={age}
        label='Age'
        onChange={handleChange}
      >
        <MenuItem value=''>
          <em>None</em>
        </MenuItem>
        <MenuItem value={10}>Ten</MenuItem>
        <MenuItem value={20}>Twenty</MenuItem>
        <MenuItem value={30}>Thirty</MenuItem>
      </Select>
    </FormControl>
  );
}

function SelectOtherProps() {
  const [age, setAge] = React.useState('');

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  return (
    <div>
      <FormControl sx={{ m: 1, minWidth: 120 }} disabled>
        <InputLabel id='demo-simple-select-disabled-label'>Age</InputLabel>
        <Select
          labelId='demo-simple-select-disabled-label'
          id='demo-simple-select-disabled'
          value={age}
          label='Age'
          onChange={handleChange}
        >
          <MenuItem value=''>
            <em>None</em>
          </MenuItem>
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select>
        <FormHelperText>Disabled</FormHelperText>
      </FormControl>
      <FormControl sx={{ m: 1, minWidth: 120 }} error>
        <InputLabel id='demo-simple-select-error-label'>Age</InputLabel>
        <Select
          labelId='demo-simple-select-error-label'
          id='demo-simple-select-error'
          value={age}
          label='Age'
          onChange={handleChange}
          renderValue={(value) => `${value}`}
        >
          <MenuItem value=''>
            <em>None</em>
          </MenuItem>
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select>
        <FormHelperText>Error</FormHelperText>
      </FormControl>
      <FormControl sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id='demo-simple-select-readonly-label'>Age</InputLabel>
        <Select
          labelId='demo-simple-select-readonly-label'
          id='demo-simple-select-readonly'
          value={age}
          label='Age'
          onChange={handleChange}
          inputProps={{ readOnly: true }}
        >
          <MenuItem value=''>
            <em>None</em>
          </MenuItem>
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select>
        <FormHelperText>Read only</FormHelperText>
      </FormControl>
      <FormControl required sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id='demo-simple-select-required-label'>Age</InputLabel>
        <Select
          labelId='demo-simple-select-required-label'
          id='demo-simple-select-required'
          value={age}
          label='Age *'
          onChange={handleChange}
        >
          <MenuItem value=''>
            <em>None</em>
          </MenuItem>
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select>
        <FormHelperText>Required</FormHelperText>
      </FormControl>
    </div>
  );
}

function NativeSelectDemo() {
  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel variant='standard' htmlFor='uncontrolled-native'>
          Age
        </InputLabel>
        <NativeSelect
          defaultValue={30}
          inputProps={{
            name: 'age',
            id: 'uncontrolled-native'
          }}
        >
          <option value={10}>Ten</option>
          <option value={20}>Twenty</option>
          <option value={30}>Thirty</option>
        </NativeSelect>
      </FormControl>
    </Box>
  );
}

const BootstrapInput = styled(InputBase)(({ theme }) => ({
  'Label + &': {
    marginTop: theme.spacing(3)
  },
  '& .InputBase-Input': {
    borderRadius: 4,
    position: 'relative',
    backgroundColor: theme.color.background,
    border: '1px solid #ced4da',
    fontSize: 16,
    padding: '10px 26px 10px 12px',
    transition: theme.transition.create(['border-color', 'box-shadow']),
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
      borderRadius: 4,
      borderColor: '#80bdff',
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)'
    }
  }
}));

function CustomizedSelects() {
  const [age, setAge] = React.useState('');
  const handleChange = (event) => {
    setAge(event.target.value);
  };
  return (
    <div>
      <FormControl sx={{ m: 1 }} variant='standard'>
        <InputLabel htmlFor='demo-customized-textbox'>Age</InputLabel>
        <BootstrapInput id='demo-customized-textbox' />
      </FormControl>
      <FormControl sx={{ m: 1 }} variant='standard'>
        <InputLabel id='demo-customized-select-label'>Age</InputLabel>
        <Select
          labelId='demo-customized-select-label'
          id='demo-customized-select'
          value={age}
          onChange={handleChange}
          input={<BootstrapInput />}
        >
          <MenuItem value=''>
            <em>None</em>
          </MenuItem>
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select>
      </FormControl>
      <FormControl sx={{ m: 1 }} variant='standard'>
        <InputLabel htmlFor='demo-customized-select-native'>Age</InputLabel>
        <NativeSelect
          id='demo-customized-select-native'
          value={age}
          onChange={handleChange}
          input={<BootstrapInput />}
        >
          <option aria-label='None' value='' />
          <option value={10}>Ten</option>
          <option value={20}>Twenty</option>
          <option value={30}>Thirty</option>
        </NativeSelect>
      </FormControl>
    </div>
  );
}

function ControlledOpenSelect() {
  const [age, setAge] = React.useState('');
  const [open, setOpen] = React.useState(false);

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <div>
      <Button sx={{ display: 'block', mt: 2 }} onClick={handleOpen}>
        Open the select
      </Button>
      <FormControl sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id='demo-controlled-open-select-label'>Age</InputLabel>
        <Select
          labelId='demo-controlled-open-select-label'
          id='demo-controlled-open-select'
          open={open}
          onClose={handleClose}
          onOpen={handleOpen}
          value={age}
          label='Age'
          onChange={handleChange}
        >
          <MenuItem value=''>
            <em>None</em>
          </MenuItem>
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}

function GroupedSelect() {
  return (
    <div>
      <FormControl sx={{ m: 1, minWidth: 120 }}>
        <InputLabel htmlFor='grouped-native-select'>Grouping</InputLabel>
        <Select native defaultValue='' id='grouped-native-select' label='Grouping'>
          <option aria-label='None' value='' />
          <optgroup label='Category 1'>
            <option value={1}>Option 1</option>
            <option value={2}>Option 2</option>
          </optgroup>
          <optgroup label='Category 2'>
            <option value={3}>Option 3</option>
            <option value={4}>Option 4</option>
          </optgroup>
        </Select>
      </FormControl>
      <FormControl sx={{ m: 1, minWidth: 120 }}>
        <InputLabel htmlFor='grouped-select'>Grouping</InputLabel>
        <Select defaultValue='' id='grouped-select' label='Grouping'>
          <MenuItem value=''>
            <em>None</em>
          </MenuItem>
          <ListSubheader>Category 1</ListSubheader>
          <MenuItem value={1}>Option 1</MenuItem>
          <MenuItem value={2}>Option 2</MenuItem>
          <ListSubheader>Category 2</ListSubheader>
          <MenuItem value={3}>Option 3</MenuItem>
          <MenuItem value={4}>Option 4</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}

export default function SelectDemo() {
  return (
    <Stack spacing={5} direction='column'>
      <Stack width='fit-content' display='inline-block' spacing={1} direction='column'>
        <Text variant='h6'>Basic Select</Text>
        <BasicSelect />
      </Stack>
      <Stack width='fit-content' display='inline-block' spacing={1} direction='column'>
        <Text variant='h6'>Select Variants</Text>
        <SelectVariants />
      </Stack>
      <Stack width='fit-content' display='inline-block' spacing={1} direction='column'>
        <Text variant='h6'>Selects with Labels & Helper Text</Text>
        <SelectLabels />
      </Stack>
      <Stack width='fit-content' display='inline-block' spacing={1} direction='column'>
        <Text variant='h6'>Auto Width Select</Text>
        <SelectAutoWidth />
      </Stack>
      <Stack width='fit-content' display='inline-block' spacing={1} direction='column'>
        <Text variant='h6'>Small Sized Select</Text>
        <SelectSmall />
      </Stack>
      <Stack width='fit-content' display='inline-block' spacing={1} direction='column'>
        <Text variant='h6'>Other Options</Text>
        <SelectOtherProps />
      </Stack>
      <Stack width='fit-content' display='inline-block' spacing={1} direction='column'>
        <Text variant='h6'>Native Select</Text>
        <NativeSelectDemo />
      </Stack>
      <Stack width='fit-content' display='inline-block' spacing={1} direction='column'>
        <Text variant='h6'>Customized Selects</Text>
        <CustomizedSelects />
      </Stack>
      <Stack width='fit-content' display='inline-block' spacing={1} direction='column'>
        <Text variant='h6'>Select with Controlled Open State</Text>
        <ControlledOpenSelect />
      </Stack>
      {/* <Stack width='fit-content' display='inline-block' spacing={1} direction='column'>
        <Text variant='h6'>With a dialog</Text>
        <MultipleSelectChip />
      </Stack> */}
      <Stack width='fit-content' display='inline-block' spacing={1} direction='column'>
        <Text variant='h6'>Select with Grouping</Text>
        <GroupedSelect />
      </Stack>
    </Stack>
  );
}
