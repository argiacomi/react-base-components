import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  Grid,
  Paper,
  Popper,
  Stack,
  Switch,
  Text,
  TextField
} from '@components';
import React from 'react';
import styled from '@styles';

function SimplePopper() {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popper' : undefined;

  return (
    <div>
      <button aria-describedby={id} type='button' onClick={handleClick}>
        Toggle Popper
      </button>
      <Popper outlined disableArrow id={id} open={open} anchorEl={anchorEl}>
        <Text sx={{ p: 1 }}>The content of the Popper.</Text>
      </Popper>
    </div>
  );
}

function TransitionsPopper() {
  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setOpen((previousOpen) => !previousOpen);
  };

  const canBeOpen = open && Boolean(anchorEl);
  const id = canBeOpen ? 'transition-popper' : undefined;

  return (
    <div>
      <button aria-describedby={id} type='button' onClick={handleClick}>
        Toggle Popper
      </button>
      <Popper outlined disableArrow id={id} open={open} anchorEl={anchorEl} transition='Zoom'>
        <Text sx={{ p: 1 }}>The content of the Popper.</Text>
      </Popper>
    </div>
  );
}

function PositionedPopper() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [placement, setPlacement] = React.useState();

  const handleClick = (newPlacement) => (event) => {
    setAnchorEl(event.currentTarget);
    setOpen((prev) => placement !== newPlacement || !prev);
    setPlacement(newPlacement);
  };

  return (
    <Box>
      <Box>
        <Popper open={open} anchorEl={anchorEl} placement={placement} transition='Grow'>
          <Text css={{ padding: '1rem' }}>The content of the Popper.</Text>
        </Popper>
        <Grid container css={{ justifyContent: 'center' }}>
          <Grid>
            <Button onClick={handleClick('top-start')}>top-start</Button>
            <Button onClick={handleClick('top')}>top</Button>
            <Button onClick={handleClick('top-end')}>top-end</Button>
          </Grid>
        </Grid>
        <Grid container css={{ justifyContent: 'center' }}>
          <Grid xs={6}>
            <Button onClick={handleClick('left-start')}>left-start</Button>
            <br />
            <Button onClick={handleClick('left')}>left</Button>
            <br />
            <Button onClick={handleClick('left-end')}>left-end</Button>
          </Grid>
          <Grid container xs={6} css={{ alignItems: 'flex-end', flexDirection: 'column' }}>
            <Grid>
              <Button onClick={handleClick('right-start')}>right-start</Button>
            </Grid>
            <Grid>
              <Button onClick={handleClick('right')}>right</Button>
            </Grid>
            <Grid>
              <Button onClick={handleClick('right-end')}>right-end</Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid container css={{ justifyContent: 'center' }}>
          <Grid>
            <Button onClick={handleClick('bottom-start')}>bottom-start</Button>
            <Button onClick={handleClick('bottom')}>bottom</Button>
            <Button onClick={handleClick('bottom-end')}>bottom-end</Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

function VirtualElementPopper() {
  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const previousAnchorElPosition = React.useRef(undefined);

  React.useEffect(() => {
    if (anchorEl) {
      if (typeof anchorEl === 'object') {
        previousAnchorElPosition.current = anchorEl.getBoundingClientRect();
      } else {
        previousAnchorElPosition.current = anchorEl().getBoundingClientRect();
      }
    }
  }, [anchorEl]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleMouseUp = () => {
    const selection = window.getSelection();

    // Resets when the selection has a length of 0
    if (!selection || selection.anchorOffset === selection.focusOffset) {
      handleClose();
      return;
    }

    const getBoundingClientRect = () => {
      if (selection.rangeCount === 0 && previousAnchorElPosition.current) {
        setOpen(false);
        return previousAnchorElPosition.current;
      }
      return selection.getRangeAt(0).getBoundingClientRect();
    };

    setOpen(true);

    setAnchorEl({ getBoundingClientRect });
  };

  const id = open ? 'virtual-element-popper' : undefined;

  return (
    <div onMouseLeave={handleClose}>
      <Text aria-describedby={id} onMouseUp={handleMouseUp}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam ipsum purus, bibendum sit
        amet vulputate eget, porta semper ligula. Donec bibendum vulputate erat, ac fringilla mi
        finibus nec. Donec ac dolor sed dolor porttitor blandit vel vel purus. Fusce vel malesuada
        ligula. Nam quis vehicula ante, eu finibus est. Proin ullamcorper fermentum orci, quis
        finibus massa. Nunc lobortis, massa ut rutrum ultrices, metus metus finibus ex, sit amet
        facilisis neque enim sed neque. Quisque accumsan metus vel maximus consequat. Suspendisse
        lacinia tellus a libero volutpat maximus.
      </Text>
      <Popper id={id} open={open} anchorEl={anchorEl} transition placement='bottom-start'>
        <Paper>
          <Text sx={{ p: 2 }}>The content of the Popper.</Text>
        </Paper>
      </Popper>
    </div>
  );
}

function ScrollPlayground() {
  const anchorRef = React.useRef(null);
  const [open, setOpen] = React.useState(false);

  const [placement, setPlacement] = React.useState('bottom');
  const [disablePortal, setDisablePortal] = React.useState(false);

  const [flip, setFlip] = React.useState({
    enabled: true,
    altBoundary: true,
    rootBoundary: 'document'
  });
  const [preventOverflow, setPreventOverflow] = React.useState({
    enabled: true,
    altAxis: true,
    altBoundary: true,
    tether: true,
    rootBoundary: 'document'
  });

  const [arrow, setArrow] = React.useState(false);
  const [arrowRef, setArrowRef] = React.useState(null);

  const handleClickButton = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const centerScroll = (element) => {
    if (!element) {
      return;
    }

    const container = element.parentElement;
    container.scrollTop = element.clientHeight / 4;
    container.scrollLeft = element.clientWidth / 4;
  };

  const id = open ? 'scroll-playground' : null;

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ height: 400, overflow: 'auto', mb: 3 }}>
        <Grid
          sx={{
            position: 'relative',
            width: '230%',
            bgcolor: 'background.paper',
            height: '230%'
          }}
          container
          alignItems='center'
          justifyContent='center'
          ref={centerScroll}
        >
          <div>
            <Button
              ref={anchorRef}
              variant='contained'
              onClick={handleClickButton}
              aria-describedby={id}
            >
              Toggle Popper
            </Button>
            <Text sx={{ mt: 2, maxWidth: 300 }}>
              Scroll around this container to experiment with flip and preventOverflow modifiers.
            </Text>
            <Popper
              id={id}
              open={open}
              arrow={arrow}
              anchorEl={anchorRef.current}
              placement={placement}
              disablePortal={disablePortal}
              modifiers={[
                {
                  name: 'flip',
                  enabled: flip.enabled,
                  options: {
                    altBoundary: flip.altBoundary,
                    rootBoundary: flip.rootBoundary,
                    padding: 8
                  }
                },
                {
                  name: 'preventOverflow',
                  enabled: preventOverflow.enabled,
                  options: {
                    altAxis: preventOverflow.altAxis,
                    altBoundary: preventOverflow.altBoundary,
                    tether: preventOverflow.tether,
                    rootBoundary: preventOverflow.rootBoundary,
                    padding: 8
                  }
                },
                {
                  name: 'arrow',
                  enabled: arrow,
                  options: {
                    element: arrowRef
                  }
                }
              ]}
            >
              <div>
                {/* {arrow ? <Arrow ref={setArrowRef} className='Popper-Arrow' /> : null} */}
                <Paper sx={{ maxWidth: 400, overflow: 'auto' }}>
                  <DialogTitle>{"Use Google's location service?"}</DialogTitle>
                  <DialogContent>
                    <DialogContentText>Let Google help apps determine location.</DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleClickButton}>Disagree</Button>
                    <Button onClick={handleClickButton}>Agree</Button>
                  </DialogActions>
                </Paper>
              </div>
            </Popper>
          </div>
        </Grid>
      </Box>
      <Grid container spacing={2}>
        <Grid container item xs={12}>
          <Grid item xs={12}>
            <Text variant='h6' component='div'>
              Appearance
            </Text>
          </Grid>
          <Grid item xs={6}>
            <TextField
              margin='dense'
              sx={{ width: 200 }}
              label='Placement'
              select
              slotProps={{
                inputLabel: {
                  id: 'scroll-playground-placement-label'
                },
                select: {
                  native: true,
                  inputProps: {
                    'aria-labelledby': 'scroll-playground-placement-label'
                  }
                }
              }}
              value={placement}
              onChange={(event) => {
                setPlacement(event.target.value);
              }}
              variant='standard'
            >
              <option value='top-start'>top-start</option>
              <option value='top'>top</option>
              <option value='top-end'>top-end</option>
              <option value='left-start'>left-start</option>
              <option value='left'>left</option>
              <option value='left-end'>left-end</option>
              <option value='right-start'>right-start</option>
              <option value='right'>right</option>
              <option value='right-end'>right-end</option>
              <option value='bottom-start'>bottom-start</option>
              <option value='bottom'>bottom</option>
              <option value='bottom-end'>bottom-end</option>
            </TextField>
          </Grid>
          <Grid item xs={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={disablePortal}
                  onChange={(event) => {
                    setDisablePortal(event.target.checked);
                  }}
                  value='disablePortal'
                />
              }
              label='Disable portal'
            />
            <Text display='block' variant='caption' color='text.secondary'>
              (the children stay within their parent DOM hierarchy)
            </Text>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Text variant='h6' component='div'>
            Modifiers (options from Popper.js)
          </Text>
        </Grid>
        <Grid container item xs={12} spacing={1}>
          <Grid item xs={6}>
            <FormGroup>
              <Text variant='subtitle1'>Prevent Overflow</Text>
              <FormControlLabel
                control={
                  <Switch
                    checked={preventOverflow.enabled}
                    onChange={(event) => {
                      setPreventOverflow((old) => ({
                        ...old,
                        enabled: event.target.checked
                      }));
                    }}
                    value='arrow'
                  />
                }
                label='Enable'
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={preventOverflow.altAxis}
                    onChange={(event) => {
                      setPreventOverflow((old) => ({
                        ...old,
                        altAxis: event.target.checked
                      }));
                    }}
                    value='alt-axis'
                  />
                }
                label='Alt axis'
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={preventOverflow.altBoundary}
                    onChange={(event) => {
                      setPreventOverflow((old) => ({
                        ...old,
                        altBoundary: event.target.checked
                      }));
                    }}
                    value='alt-boundary'
                  />
                }
                label='Alt Boundary'
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={preventOverflow.tether}
                    onChange={(event) => {
                      setPreventOverflow((old) => ({
                        ...old,
                        tether: event.target.checked
                      }));
                    }}
                    value='tether'
                  />
                }
                label='Tether'
              />
              <TextField
                margin='dense'
                size='small'
                label='Root Boundary'
                select
                slotProps={{
                  inputLabel: {
                    id: 'scroll-playground-prevent-overflow-root-boundary'
                  },
                  select: {
                    native: true,
                    inputProps: {
                      'aria-labelledby': 'scroll-playground-prevent-overflow-root-boundary'
                    }
                  }
                }}
                value={preventOverflow.rootBoundary}
                onChange={(event) => {
                  setPreventOverflow((old) => ({
                    ...old,
                    rootBoundary: event.target.value
                  }));
                }}
                variant='standard'
              >
                <option value='document'>document</option>
                <option value='viewport'>viewport</option>
              </TextField>
            </FormGroup>
          </Grid>
          <Grid item xs={6}>
            <FormGroup>
              <Text variant='subtitle1'>Flip</Text>
              <FormControlLabel
                control={
                  <Switch
                    checked={flip.enabled}
                    onChange={(event) => {
                      setFlip((old) => ({
                        ...old,
                        enabled: event.target.checked
                      }));
                    }}
                    value='enabled'
                  />
                }
                label='Enable'
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={flip.altBoundary}
                    onChange={(event) => {
                      setFlip((old) => ({
                        ...old,
                        altBoundary: event.target.checked
                      }));
                    }}
                    value='alt-boundary'
                  />
                }
                label='Alt Boundary'
              />
              <TextField
                margin='dense'
                size='small'
                label='Root Boundary'
                select
                slotProps={{
                  inputLabel: {
                    id: 'scroll-playground-flip-root-boundary'
                  },
                  select: {
                    native: true,
                    inputProps: {
                      'aria-labelledby': 'scroll-playground-flip-root-boundary'
                    }
                  }
                }}
                value={flip.rootBoundary}
                onChange={(event) => {
                  setFlip((old) => ({
                    ...old,
                    rootBoundary: event.target.value
                  }));
                }}
                variant='standard'
              >
                <option value='document'>document</option>
                <option value='viewport'>viewport</option>
              </TextField>
            </FormGroup>
            <FormGroup>
              <Text variant='subtitle1'>Arrow</Text>
              <FormControlLabel
                control={
                  <Switch
                    checked={arrow}
                    onChange={(event) => {
                      setArrow(event.target.checked);
                    }}
                    value='arrow'
                  />
                }
                label='Enable'
              />
            </FormGroup>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}

export default function PopperDemo() {
  return (
    <Stack width='fit-content' spacing={5} direction='column'>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Basic Popper</Text>
        <SimplePopper />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Transitioned Popper</Text>
        <TransitionsPopper />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Positioned Popper</Text>
        <PositionedPopper />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Virtual Element</Text>
        <VirtualElementPopper />
      </Stack>
    </Stack>
  );
}
