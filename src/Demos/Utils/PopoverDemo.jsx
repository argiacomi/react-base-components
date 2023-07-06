import React from 'react';
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Input,
  InputLabel,
  Paper,
  Popover,
  Radio,
  RadioGroup,
  Stack,
  Text
} from '@components';

function BasicPopover() {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <div>
      <Button aria-describedby={id} variant='filled' onClick={handleClick}>
        Open Popover
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
      >
        <Text sx={{ p: 2 }}>The content of the Popover.</Text>
      </Popover>
    </div>
  );
}

function MouseOverPopover() {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <Box>
      <Text
        aria-owns={open ? 'mouse-over-popover' : undefined}
        aria-haspopup='true'
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
      >
        Hover with a Popover.
      </Text>
      <Popover
        id='mouse-over-popover'
        sx={{
          pointerEvents: 'none'
        }}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <Text sx={{ p: 1 }}>I use Popover.</Text>
      </Popover>
    </Box>
  );
}

function VirtualElementPopover() {
  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClose = () => {
    setOpen(false);
  };

  const handleMouseUp = () => {
    const selection = window.getSelection();

    // Skip if selection has a length of 0
    if (!selection || selection.anchorOffset === selection.focusOffset) {
      return;
    }

    const getBoundingClientRect = () => {
      return selection.getRangeAt(0).getBoundingClientRect();
    };

    setOpen(true);

    setAnchorEl({ getBoundingClientRect, nodeType: 1 });
  };

  const id = open ? 'virtual-element-popover' : undefined;

  return (
    <div>
      <Text aria-describedby={id} onMouseUp={handleMouseUp}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam ipsum purus, bibendum sit
        amet vulputate eget, porta semper ligula. Donec bibendum vulputate erat, ac fringilla mi
        finibus nec. Donec ac dolor sed dolor porttitor blandit vel vel purus. Fusce vel malesuada
        ligula. Nam quis vehicula ante, eu finibus est. Proin ullamcorper fermentum orci, quis
        finibus massa. Nunc lobortis, massa ut rutrum ultrices, metus metus finibus ex, sit amet
        facilisis neque enim sed neque. Quisque accumsan metus vel maximus consequat. Suspendisse
        lacinia tellus a libero volutpat maximus.
      </Text>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        onClose={handleClose}
      >
        <Paper>
          <Text sx={{ p: 2 }}>The content of the Popover.</Text>
        </Paper>
      </Popover>
    </div>
  );
}

const inlineStyles = {
  anchorVertical: {
    top: {
      top: -5
    },
    center: {
      top: 'calc(50% - 5px)'
    },
    bottom: {
      bottom: -5
    }
  },
  anchorHorizontal: {
    left: {
      left: -5
    },
    center: {
      left: 'calc(50% - 5px)'
    },
    right: {
      right: -5
    }
  }
};

function AnchorPlayground() {
  const anchorRef = React.useRef();

  const [state, setState] = React.useState({
    open: false,
    anchorOriginVertical: 'top',
    anchorOriginHorizontal: 'left',
    transformOriginVertical: 'top',
    transformOriginHorizontal: 'left',
    positionTop: 200, // Just so the popover can be spotted more easily
    positionLeft: 400, // Same as above
    anchorReference: 'anchorEl'
  });

  const {
    open,
    anchorOriginVertical,
    anchorOriginHorizontal,
    transformOriginVertical,
    transformOriginHorizontal,
    positionTop,
    positionLeft,
    anchorReference
  } = state;

  const handleChange = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.value
    });
  };

  const handleNumberInputChange = (key) => (event) => {
    setState({
      ...state,
      [key]: parseInt(event.target.value, 10)
    });
  };

  const handleClickButton = () => {
    setState({
      ...state,
      open: true
    });
  };

  const handleClose = () => {
    setState({
      ...state,
      open: false
    });
  };

  let mode = '';

  if (anchorReference === 'anchorPosition') {
    mode = `
  anchorReference="${anchorReference}"
  anchorPosition={{ top: ${positionTop}, left: ${positionLeft} }}`;
  }

  const jsx = `
<Popover ${mode}
  anchorOrigin={{
    vertical: '${anchorOriginVertical}',
    horizontal: '${anchorOriginHorizontal}',
  }}
  transformOrigin={{
    vertical: '${transformOriginVertical}',
    horizontal: '${transformOriginHorizontal}',
  }}
>
  The content of the Popover.
</Popover>
`;

  const radioAnchorClasses = {
    color: 'success',
    '&.Checked': {
      color: 'success'
    }
  };

  return (
    <div>
      <Grid container justifyContent='center'>
        <Grid sx={{ position: 'relative', mb: 4 }}>
          <Button ref={anchorRef} variant='filled' onClick={handleClickButton}>
            Open Popover
          </Button>
          {anchorReference === 'anchorEl' && (
            <Box
              sx={{
                backgroundColor: 'success',
                width: 10,
                height: 10,
                borderRadius: '50%',
                position: 'absolute'
              }}
              style={{
                ...inlineStyles.anchorVertical[anchorOriginVertical],
                ...inlineStyles.anchorHorizontal[anchorOriginHorizontal]
              }}
            />
          )}
        </Grid>
      </Grid>
      <Popover
        open={open}
        anchorEl={anchorRef.current}
        anchorReference={anchorReference}
        anchorPosition={{
          top: positionTop,
          left: positionLeft
        }}
        onClose={handleClose}
        anchorOrigin={{
          vertical: anchorOriginVertical,
          horizontal: anchorOriginHorizontal
        }}
        transformOrigin={{
          vertical: transformOriginVertical,
          horizontal: transformOriginHorizontal
        }}
      >
        <Text sx={{ m: 2 }}>The content of the Popover.</Text>
      </Popover>
      <Grid container spacing={2}>
        <Grid xs={12} sm={6}>
          <FormControl component='fieldset'>
            <FormLabel component='legend'>anchorReference</FormLabel>
            <RadioGroup
              row
              aria-label='anchor reference'
              name='anchorReference'
              value={anchorReference}
              onChange={handleChange}
            >
              <FormControlLabel value='anchorEl' control={<Radio />} label='anchorEl' />
              <FormControlLabel value='anchorPosition' control={<Radio />} label='anchorPosition' />
            </RadioGroup>
          </FormControl>
        </Grid>
        <Grid xs={12} sm={6}>
          <FormControl variant='standard'>
            <InputLabel htmlFor='position-top'>anchorPosition.top</InputLabel>
            <Input
              id='position-top'
              type='number'
              value={positionTop}
              onChange={handleNumberInputChange('positionTop')}
            />
          </FormControl>
          &nbsp;
          <FormControl variant='standard'>
            <InputLabel htmlFor='position-left'>anchorPosition.left</InputLabel>
            <Input
              id='position-left'
              type='number'
              value={positionLeft}
              onChange={handleNumberInputChange('positionLeft')}
            />
          </FormControl>
        </Grid>
        <Grid xs={12} sm={6}>
          <FormControl component='fieldset'>
            <FormLabel component='legend'>anchorOrigin.vertical</FormLabel>
            <RadioGroup
              aria-label='anchor origin vertical'
              name='anchorOriginVertical'
              value={anchorOriginVertical}
              onChange={handleChange}
            >
              <FormControlLabel
                value='top'
                control={<Radio sx={radioAnchorClasses} />}
                label='Top'
              />
              <FormControlLabel
                value='center'
                control={<Radio sx={radioAnchorClasses} />}
                label='Center'
              />
              <FormControlLabel
                value='bottom'
                control={<Radio sx={radioAnchorClasses} />}
                label='Bottom'
              />
            </RadioGroup>
          </FormControl>
        </Grid>
        <Grid xs={12} sm={6}>
          <FormControl component='fieldset'>
            <FormLabel component='legend'>transformOrigin.vertical</FormLabel>
            <RadioGroup
              aria-label='transform origin vertical'
              name='transformOriginVertical'
              value={transformOriginVertical}
              onChange={handleChange}
            >
              <FormControlLabel value='top' control={<Radio />} label='Top' />
              <FormControlLabel value='center' control={<Radio color='primary' />} label='Center' />
              <FormControlLabel value='bottom' control={<Radio color='primary' />} label='Bottom' />
            </RadioGroup>
          </FormControl>
        </Grid>
        <Grid xs={12} sm={6}>
          <FormControl component='fieldset'>
            <FormLabel component='legend'>anchorOrigin.horizontal</FormLabel>
            <RadioGroup
              row
              aria-label='anchor origin horizontal'
              name='anchorOriginHorizontal'
              value={anchorOriginHorizontal}
              onChange={handleChange}
            >
              <FormControlLabel
                value='left'
                control={<Radio sx={radioAnchorClasses} />}
                label='Left'
              />
              <FormControlLabel
                value='center'
                control={<Radio sx={radioAnchorClasses} />}
                label='Center'
              />
              <FormControlLabel
                value='right'
                control={<Radio sx={radioAnchorClasses} />}
                label='Right'
              />
            </RadioGroup>
          </FormControl>
        </Grid>
        <Grid xs={12} sm={6}>
          <FormControl component='fieldset'>
            <FormLabel component='legend'>transformOrigin.horizontal</FormLabel>
            <RadioGroup
              row
              aria-label='transform origin horizontal'
              name='transformOriginHorizontal'
              value={transformOriginHorizontal}
              onChange={handleChange}
            >
              <FormControlLabel value='left' control={<Radio color='primary' />} label='Left' />
              <FormControlLabel value='center' control={<Radio color='primary' />} label='Center' />
              <FormControlLabel value='right' control={<Radio color='primary' />} label='Right' />
            </RadioGroup>
          </FormControl>
        </Grid>
      </Grid>
    </div>
  );
}

export default function PopoverDemo() {
  return (
    <Stack spacing={2} direction='column'>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Basic Popover</Text>
        <BasicPopover />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Popover with Mouseover Interaction</Text>
        <MouseOverPopover />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Popover with Virtual Element</Text>
        <VirtualElementPopover />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Popover Anchor Playground</Text>
        <AnchorPlayground />
      </Stack>
    </Stack>
  );
}
