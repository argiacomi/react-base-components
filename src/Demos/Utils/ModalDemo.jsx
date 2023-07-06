import React from 'react';
import styled, { useTheme } from '@styles';
import { Backdrop, Box, Button, Fade, Modal, Stack, Text } from '@components';

const StyleBox = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  backgroundColor: theme.color.background,
  border: '2px solid #000',
  boxShadow: theme.boxShadow[24],
  padding: '2rem'
}));

function BasicModal() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Button onClick={handleOpen}>Basic modal</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <StyleBox>
          <Text id='modal-modal-title' variant='h6' component='h2'>
            Text in a modal
          </Text>
          <Text id='modal-modal-description' css={{ marginTop: '1rem' }}>
            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
          </Text>
        </StyleBox>
      </Modal>
    </div>
  );
}

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  backgroundColor: 'background',
  border: '2px solid #000',
  pt: 2,
  px: 4,
  pb: 3
};

function ChildModal() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const theme = useTheme();

  return (
    <React.Fragment>
      <Button onClick={handleOpen}>Open Child Modal</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby='child-modal-title'
        aria-describedby='child-modal-description'
      >
        <Box sx={{ ...style, width: 200 }} boxShadow={theme.boxShadow[24]}>
          <h2 id='child-modal-title'>Text in a child modal</h2>
          <p id='child-modal-description'>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit.
          </p>
          <Button onClick={handleClose}>Close Child Modal</Button>
        </Box>
      </Modal>
    </React.Fragment>
  );
}

function NestedModal() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const theme = useTheme();

  return (
    <div>
      <Button onClick={handleOpen}>Open modal</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby='parent-modal-title'
        aria-describedby='parent-modal-description'
      >
        <Box sx={{ ...style, width: 400 }} boxShadow={theme.boxShadow[24]}>
          <h2 id='parent-modal-title'>Text in a modal</h2>
          <p id='parent-modal-description'>
            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
          </p>
          <ChildModal />
        </Box>
      </Modal>
    </div>
  );
}

function TransitionsModal() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Button onClick={handleOpen}>Transition modal</Button>
      <Modal
        aria-labelledby='transition-modal-title'
        aria-describedby='transition-modal-description'
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500
          }
        }}
      >
        <Fade in={open}>
          <StyleBox>
            <Text id='transition-modal-title' variant='h6' component='h2'>
              Text in a modal
            </Text>
            <Text id='transition-modal-description' css={{ marginTop: '1rem' }}>
              Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
            </Text>
          </StyleBox>
        </Fade>
      </Modal>
    </div>
  );
}

function KeepMountedModal() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Button onClick={handleOpen}>keepMounted modal</Button>
      <Modal
        keepMounted
        open={open}
        onClose={handleClose}
        aria-labelledby='keep-mounted-modal-title'
        aria-describedby='keep-mounted-modal-description'
      >
        <StyleBox>
          <Text id='keep-mounted-modal-title' variant='h6' component='h2'>
            Text in a modal
          </Text>
          <Text id='keep-mounted-modal-description' css={{ marginTop: '1rem' }}>
            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
          </Text>
        </StyleBox>
      </Modal>
    </div>
  );
}

function ServerModal() {
  const rootRef = React.useRef(null);
  const theme = useTheme();

  return (
    <Box
      sx={{
        height: 300,
        backgroundColor: 'gray.500',
        flexGrow: 1,
        minWidth: 300,
        transform: 'translateZ(0)',
        '@media all and (-ms-high-contrast: none)': {
          display: 'none'
        }
      }}
      className='Drew'
      ref={rootRef}
    >
      <Modal
        disablePortal
        disableEnforceFocus
        disableAutoFocus
        open
        aria-labelledby='server-modal-title'
        aria-describedby='server-modal-description'
        sx={{
          display: 'flex',
          padding: 1,
          alignItems: 'center',
          justifyContent: 'center'
        }}
        container={() => rootRef.current}
      >
        <Box
          css={{
            position: 'relative',
            width: 400,
            backgroundColor: theme.color.background,
            border: '2px solid #000',
            boxShadow: theme.boxShadow[5],
            padding: '2rem'
          }}
        >
          <Text id='server-modal-title' variant='h6' component='h2'>
            Server-side modal
          </Text>
          <Text id='server-modal-description' sx={{ pt: 2 }}>
            If you disable JavaScript, you will still see me.
          </Text>
        </Box>
      </Modal>
    </Box>
  );
}

export default function ModalDemo() {
  return (
    <Stack spacing={2} direction='column'>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Basic Modal</Text>
        <BasicModal />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Nested Modal</Text>
        <NestedModal />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Modal Transitions</Text>
        <TransitionsModal />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Keep Modal Mounted</Text>
        <KeepMountedModal />
      </Stack>
      <Stack spacing={1} direction='column'>
        <Text variant='h6'>Server Side Modal</Text>
        <ServerModal />
      </Stack>
    </Stack>
  );
}
