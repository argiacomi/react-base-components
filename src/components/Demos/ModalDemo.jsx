import React from 'react';
import { styled } from '@styles';
import { Backdrop, Box, Button, Fade, Modal, Stack, Text } from '@components';

const StyleBox = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  backgroundColor: theme.color.background,
  border: '2px solid #000',
  boxShadow: '24px',
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

function ChildModal() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Button onClick={handleOpen}>Open Child Modal</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby='child-modal-title'
        aria-describedby='child-modal-description'
      >
        <StyleBox
          css={{ width: 200, paddingTop: '1rem', paddingLeft: '2rem', paddingBottom: '1.5rem' }}
        >
          <h2 id='child-modal-title'>Text in a child modal</h2>
          <p id='child-modal-description'>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit.
          </p>
          <Button onClick={handleClose}>Close Child Modal</Button>
        </StyleBox>
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

  return (
    <div>
      <Button onClick={handleOpen}>Nested modal</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby='parent-modal-title'
        aria-describedby='parent-modal-description'
      >
        <StyleBox css={{ paddingTop: '1rem', paddingLeft: '2rem', paddingBottom: '1.5rem' }}>
          <h2 id='parent-modal-title'>Text in a modal</h2>
          <p id='parent-modal-description'>
            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
          </p>
          <ChildModal />
        </StyleBox>
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

export default function ModalDemo() {
  return (
    <Stack spacing={2} direction='column'>
      <BasicModal />
      <NestedModal />
      <TransitionsModal />
      <KeepMountedModal />
    </Stack>
  );
}
