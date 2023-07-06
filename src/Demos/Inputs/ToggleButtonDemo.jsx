import React from 'react';
import styled from 'styled-components/macro';
import { Divider, Paper, Stack, ToggleButton, ToggleButtonGroup, Text } from '@components';

function ToggleButtons() {
  const [alignment, setAlignment] = React.useState('left');

  const handleAlignment = (event, newAlignment) => {
    setAlignment(newAlignment);
  };

  return (
    <ToggleButtonGroup
      value={alignment}
      exclusive
      onChange={handleAlignment}
      aria-label='text alignment'
    >
      <ToggleButton value='left' aria-label='left aligned' icon='MdFormatAlignLeft' />
      <ToggleButton value='center' aria-label='centered' icon='MdFormatAlignCenter' />
      <ToggleButton value='right' aria-label='right aligned' icon='MdFormatAlignRight' />
      <ToggleButton value='justify' aria-label='justified' disabled icon='MdFormatAlignJustify' />
    </ToggleButtonGroup>
  );
}

function ToggleButtonsMultiple() {
  const [formats, setFormats] = React.useState(() => ['bold', 'italic']);

  const handleFormat = (event, newFormats) => {
    setFormats(newFormats);
  };

  return (
    <ToggleButtonGroup value={formats} onChange={handleFormat} aria-label='text formatting'>
      <ToggleButton value='bold' aria-label='bold' icon='MdFormatBold' />
      <ToggleButton value='italic' aria-label='italic' icon='MdFormatItalic' />
      <ToggleButton value='underlined' aria-label='underlined' icon='MdFormatUnderlined' />
      <ToggleButton
        value='color'
        aria-label='color'
        disabled
        icon={['MdFormatColorFill', 'MdArrowDropDown']}
      />
    </ToggleButtonGroup>
  );
}

function ToggleButtonSizes() {
  const [alignment, setAlignment] = React.useState('left');

  const handleChange = (event, newAlignment) => {
    setAlignment(newAlignment);
  };

  const children = [
    <ToggleButton value='left' key='left' aria-label='left aligned' icon='MdFormatAlignLeft' />,
    <ToggleButton value='center' key='center' aria-label='centered' icon='MdFormatAlignCenter' />,
    <ToggleButton value='right' key='right' aria-label='right aligned' icon='MdFormatAlignRight' />,
    <ToggleButton
      value='justify'
      key='justify'
      aria-label='justified'
      disabled
      icon='MdFormatAlignJustify'
    />
  ];

  const control = {
    value: alignment,
    onChange: handleChange,
    exclusive: true
  };

  return (
    <Stack width='fit-content' spacing={2} alignItems='center'>
      <ToggleButtonGroup size='small' {...control} aria-label='Small sizes'>
        {children}
      </ToggleButtonGroup>
      <ToggleButtonGroup {...control} aria-label='Medium sizes'>
        {children}
      </ToggleButtonGroup>
      <ToggleButtonGroup size='large' {...control} aria-label='Large sizes'>
        {children}
      </ToggleButtonGroup>
    </Stack>
  );
}

function ColorToggleButton() {
  const [alignment, setAlignment] = React.useState('web');

  const handleChange = (event, newAlignment) => {
    setAlignment(newAlignment);
  };

  return (
    <ToggleButtonGroup
      color='primary'
      value={alignment}
      exclusive
      onChange={handleChange}
      aria-label='Platform'
    >
      <ToggleButton value='web'>Web</ToggleButton>
      <ToggleButton value='android'>Android</ToggleButton>
      <ToggleButton value='ios'>iOS</ToggleButton>
    </ToggleButtonGroup>
  );
}

function VerticalToggleButtons() {
  const [view, setView] = React.useState('list');

  const handleChange = (event, nextView) => {
    setView(nextView);
  };

  return (
    <ToggleButtonGroup orientation='vertical' value={view} exclusive onChange={handleChange}>
      <ToggleButton value='list' aria-label='list' icon='MdViewList' />
      <ToggleButton value='module' aria-label='module' icon='MdViewModule' />
      <ToggleButton value='quilt' aria-label='quilt' icon='MdViewQuilt' />
    </ToggleButtonGroup>
  );
}

function ToggleButtonNotEmpty() {
  const [alignment, setAlignment] = React.useState('left');
  const [devices, setDevices] = React.useState(() => ['phone']);

  const handleAlignment = (event, newAlignment) => {
    if (newAlignment !== null) {
      setAlignment(newAlignment);
    }
  };

  const handleDevices = (event, newDevices) => {
    if (newDevices.length) {
      setDevices(newDevices);
    }
  };

  return (
    <Stack direction='row' spacing={4}>
      <ToggleButtonGroup
        value={alignment}
        exclusive
        onChange={handleAlignment}
        aria-label='text alignment'
      >
        <ToggleButton value='left' aria-label='left aligned' icon='MdFormatAlignLeft' />
        <ToggleButton value='center' aria-label='centered' icon='MdFormatAlignCenter' />
        <ToggleButton value='right' aria-label='right aligned' icon='MdFormatAlignRight' />
      </ToggleButtonGroup>

      <ToggleButtonGroup value={devices} onChange={handleDevices} aria-label='device'>
        <ToggleButton value='laptop' aria-label='laptop' icon='MdLaptop' />
        <ToggleButton value='tv' aria-label='tv' icon='MdTv' />
        <ToggleButton value='phone' aria-label='phone' icon='MdPhoneAndroid' />
      </ToggleButtonGroup>
    </Stack>
  );
}
function StandaloneToggleButton() {
  const [selected, setSelected] = React.useState(false);

  return (
    <ToggleButton
      value='check'
      selected={selected}
      onChange={() => {
        setSelected(!selected);
      }}
      icon='MdCheck'
    />
  );
}

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  '& .ToggleButtonGroup-Grouped': {
    margin: theme.spacing(0.5),
    border: 0,
    '&.Disabled': {
      border: 0
    },
    '&:not(:first-of-type)': {
      borderRadius: theme.rounded.md
    },
    '&:first-of-type': {
      borderRadius: theme.rounded.md
    }
  }
}));

function CustomizedDividers() {
  const [alignment, setAlignment] = React.useState('left');
  const [formats, setFormats] = React.useState(() => ['italic']);

  const handleFormat = (event, newFormats) => {
    setFormats(newFormats);
  };

  const handleAlignment = (event, newAlignment) => {
    setAlignment(newAlignment);
  };

  return (
    <div>
      <Paper
        elevation={0}
        sx={{
          display: 'flex',
          width: 'fit-content',
          border: '1px',
          borderColor: 'divider',
          flexWrap: 'wrap'
        }}
      >
        <StyledToggleButtonGroup
          size='small'
          value={alignment}
          exclusive
          onChange={handleAlignment}
          aria-label='text alignment'
        >
          <ToggleButton value='left' aria-label='left aligned' icon='MdFormatAlignLeft' />
          <ToggleButton value='center' aria-label='centered' icon='MdFormatAlignCenter' />
          <ToggleButton value='right' aria-label='right aligned' icon='MdFormatAlignRight' />
          <ToggleButton
            value='justify'
            aria-label='justified'
            disabled
            icon='MdFormatAlignJustify'
          />
        </StyledToggleButtonGroup>
        <Divider flexItem orientation='vertical' sx={{ mx: 0.5, my: 1 }} />
        <StyledToggleButtonGroup
          size='small'
          value={formats}
          onChange={handleFormat}
          aria-label='text formatting'
        >
          <ToggleButton value='left' aria-label='left aligned' icon='MdFormatBold' />
          <ToggleButton value='center' aria-label='centered' icon='MdFormatItalic' />
          <ToggleButton value='right' aria-label='right aligned' icon='MdFormatUnderline' />
          <ToggleButton
            value='color'
            aria-label='color'
            disabled
            icon={['MdFormatColorFil', 'MdArrowDropDown']}
          />
        </StyledToggleButtonGroup>
      </Paper>
    </div>
  );
}

export default function SwitchDemo() {
  return (
    <Stack spacing={5} direction='column'>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Exclusive Selection</Text>
        <ToggleButtons />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Multiple Selection</Text>
        <ToggleButtonsMultiple />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Toggle Button Sizes</Text>
        <ToggleButtonSizes />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Color Toggle Buttons</Text>
        <ColorToggleButton />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Vertical Toggle Buttons</Text>
        <VerticalToggleButtons />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Enforce Value Set</Text>
        <ToggleButtonNotEmpty />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Stand Alone Toggle Button</Text>
        <StandaloneToggleButton />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Customization</Text>
        <CustomizedDividers />
      </Stack>
    </Stack>
  );
}
