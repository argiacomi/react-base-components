import * as React from 'react';
import {
  Alert,
  Button,
  Snackbar,
  Stack,
  IconButton,
  Icon,
  SnackbarProvider,
  useSnackbarQueue
} from '@components';

function SnackbarQueueDemo() {
  const { addSnackbar, closeSnackbar } = useSnackbarQueue();
  const severityVariants = ['success', 'warning', 'danger', 'info'];
  const alertVariants = ['standard', 'outlined', 'filled'];

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    closeSnackbar();
  };

  const alert = (severity, variant) => (
    <Alert elevation={6} variant={variant} onClose={handleClose} severity={severity}>
      {`This is a ${variant} ${severity} message!`}
    </Alert>
  );

  const action = (
    <React.Fragment>
      <Button variant='colorText' color='secondary' size='small' onClick={handleClose}>
        UNDO
      </Button>
      <IconButton size='small' aria-label='close' color='inherit' onClick={handleClose}>
        <Icon icon='MdClose' fontSize='small' />
      </IconButton>
    </React.Fragment>
  );

  const handleClick = () => {
    addSnackbar('This is just a regular message.', {
      action: action
    });
  };

  const handleClickVariant = (severity) => () => {
    addSnackbar('This is a success message!', {
      action: action,
      children: alert(severity, 'filled')
    });
  };

  const handleClickVariants = () => {
    let index1 = 0;
    let index2 = 0;
    const intervalId = setInterval(() => {
      addSnackbar(`This is a ${alertVariants[index2]} ${severityVariants[index1]} alert!`, {
        action: action,
        children: alert(severityVariants[index1], alertVariants[index2])
      });
      index1++;
      index2++;
      if (index1 === severityVariants.length) {
        clearInterval(intervalId);
      }
      if (index2 === alertVariants.length) {
        index2 = 0;
      }
    }, 500);
  };

  return (
    <React.Fragment>
      <Button onClick={handleClick}>Show snackbar</Button>
      <Button onClick={handleClickVariant('success')}>Show success snackbar</Button>
      <Button onClick={handleClickVariants}>Show all Alerts</Button>
    </React.Fragment>
  );
}

export default function SnackbarDemo() {
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const [openTwo, setOpenTwo] = React.useState(false);

  const handleClickTwo = () => {
    setOpenTwo(true);
  };

  const handleCloseTwo = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenTwo(false);
  };

  const [state, setState] = React.useState({
    open: false,
    vertical: 'top',
    horizontal: 'center'
  });
  const { vertical, horizontal, open: openThree } = state;

  const handleClickThree = (newState) => () => {
    setState({ open: true, ...newState });
  };

  const handleCloseThree = () => {
    setState({ ...state, open: false });
  };

  const [stateTwo, setStateTwo] = React.useState({
    open: false,
    transition: 'Slide'
  });
  const { transition, open: openFour } = stateTwo;

  const handleClickFour = (newState) => () => {
    setStateTwo({ open: true, ...newState });
  };

  const handleCloseFour = () => {
    setStateTwo({ ...state, open: false });
  };

  const anchorOriginButtons = (
    <React.Fragment>
      <Button
        onClick={handleClickThree({
          vertical: 'top',
          horizontal: 'center'
        })}
      >
        Top-Center
      </Button>
      <Button
        onClick={handleClickThree({
          vertical: 'top',
          horizontal: 'right'
        })}
      >
        Top-Right
      </Button>
      <Button
        onClick={handleClickThree({
          vertical: 'bottom',
          horizontal: 'right'
        })}
      >
        Bottom-Right
      </Button>
      <Button
        onClick={handleClickThree({
          vertical: 'bottom',
          horizontal: 'center'
        })}
      >
        Bottom-Center
      </Button>
      <Button
        onClick={handleClickThree({
          vertical: 'bottom',
          horizontal: 'left'
        })}
      >
        Bottom-Left
      </Button>
      <Button
        onClick={handleClickThree({
          vertical: 'top',
          horizontal: 'left'
        })}
      >
        Top-Left
      </Button>
    </React.Fragment>
  );

  const transitionButton = (
    <React.Fragment>
      <Button
        onClick={handleClickFour({
          transition: 'Collapse'
        })}
      >
        Collapse
      </Button>
      <Button
        onClick={handleClickFour({
          transition: 'Fade'
        })}
      >
        Fade
      </Button>
      <Button
        onClick={handleClickFour({
          transition: 'Grow'
        })}
      >
        Grow
      </Button>
      <Button
        onClick={handleClickFour({
          transition: 'Slide'
        })}
      >
        Slide
      </Button>
      <Button
        onClick={handleClickFour({
          transition: 'Zoom'
        })}
      >
        Zoom
      </Button>
    </React.Fragment>
  );

  const action = (
    <React.Fragment>
      <Button variant='colorText' color='secondary' size='small' onClick={handleCloseThree}>
        UNDO
      </Button>
      <IconButton size='small' aria-label='close' color='inherit' onClick={handleCloseThree}>
        <Icon icon='MdClose' fontSize='small' />
      </IconButton>
    </React.Fragment>
  );

  return (
    <Stack spacing={1} direction='column'>
      <Button onClick={handleClick}>Open simple snackbar</Button>
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        message='Note archived'
        action={action}
      />
      <Stack spacing={2} css={{ width: '100%' }}>
        <Button variant='outlined' onClick={handleClickTwo}>
          Open success snackbar
        </Button>
        <Snackbar open={openTwo} autoHideDuration={3000} onClose={handleCloseTwo}>
          <Alert elevation={6} variant='filled' onClose={handleCloseTwo} severity='success'>
            This is a success message!
          </Alert>
        </Snackbar>
      </Stack>
      <Stack spacing={1} direction='row'>
        {anchorOriginButtons}
        <Snackbar
          anchorOrigin={{ vertical, horizontal }}
          open={openThree}
          autoHideDuration={3000}
          onClose={handleCloseThree}
          message='I love snacks'
          key={vertical + horizontal}
        />
      </Stack>
      <Stack spacing={1} direction='row'>
        {transitionButton}
        <Snackbar
          transition={transition}
          open={openFour}
          autoHideDuration={3000}
          onClose={handleCloseFour}
          message='I love snacks'
          key={transition}
        />
      </Stack>
      <SnackbarProvider maxSnack={5}>
        <SnackbarQueueDemo />
      </SnackbarProvider>
    </Stack>
  );
}
