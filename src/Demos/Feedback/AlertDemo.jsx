import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Collapse,
  Icon,
  IconButton,
  Stack,
  Text
} from '@components';
import React from 'react';

function BasicAlerts() {
  const variants = ['standard', 'outlined', 'filled'];

  return (
    <Stack sx={{ width: '100%' }} spacing={2}>
      {variants.map((variant, index) => (
        <>
          <Alert key={index} variant={variant} severity='danger'>
            This is an error alert — check it out!
          </Alert>
          <Alert key={index + 10} variant={variant} severity='warning'>
            This is a warning alert — check it out!
          </Alert>
          <Alert key={index + 20} variant={variant} severity='info'>
            This is an info alert — check it out!
          </Alert>
          <Alert key={index + 30} variant={variant} severity='success'>
            This is a success alert — check it out!
          </Alert>
        </>
      ))}
    </Stack>
  );
}

function DescriptionAlerts() {
  return (
    <Stack sx={{ width: '100%' }} spacing={2}>
      <Alert severity='danger'>
        <AlertTitle>Error</AlertTitle>
        This is an error alert — <strong>check it out!</strong>
      </Alert>
      <Alert severity='warning'>
        <AlertTitle>Warning</AlertTitle>
        This is a warning alert — <strong>check it out!</strong>
      </Alert>
      <Alert severity='info'>
        <AlertTitle>Info</AlertTitle>
        This is an info alert — <strong>check it out!</strong>
      </Alert>
      <Alert severity='success'>
        <AlertTitle>Success</AlertTitle>
        This is a success alert — <strong>check it out!</strong>
      </Alert>
    </Stack>
  );
}

function ActionAlerts() {
  return (
    <Stack sx={{ width: '100%' }} spacing={2}>
      <Alert sx={{ color: 'white' }} onClose={() => {}}>
        This is a success alert — check it out!
      </Alert>
      <Alert
        action={
          <Button color='white' size='small'>
            UNDO
          </Button>
        }
      >
        This is a success alert — check it out!
      </Alert>
    </Stack>
  );
}

function TransitionAlerts() {
  const [open, setOpen] = React.useState(true);

  return (
    <Box sx={{ width: '100%' }}>
      <Collapse in={open}>
        <Alert
          action={
            <IconButton
              aria-label='close'
              color='inherit'
              size='small'
              onClick={() => {
                setOpen(false);
              }}
              icon='MdClose'
            />
          }
          sx={{ mb: 2 }}
        >
          Close me!
        </Alert>
      </Collapse>
      <Button
        disabled={open}
        variant='outlined'
        onClick={() => {
          setOpen(true);
        }}
      >
        Re-open
      </Button>
    </Box>
  );
}

function IconAlerts() {
  return (
    <Stack sx={{ width: '100%' }} spacing={2}>
      <Alert icon={<Icon icon='MdCheck' fontSize='inherit' />} severity='success'>
        This is a success alert — check it out!
      </Alert>
      <Alert
        iconMapping={{
          success: <Icon icon='MdCheckCircleOutline' fontSize='inherit' />
        }}
      >
        This is a success alert — check it out!
      </Alert>
      <Alert icon={false} severity='success'>
        This is a success alert — check it out!
      </Alert>
    </Stack>
  );
}

export default function AlertDemo() {
  return (
    <Stack spacing={5} direction='column'>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Basic Alerts</Text>
        <BasicAlerts />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Alerts with Description</Text>
        <DescriptionAlerts />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Actionable Alerts</Text>
        <ActionAlerts />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Alert Transitions</Text>
        <TransitionAlerts />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Alert Icons</Text>
        <IconAlerts />
      </Stack>
    </Stack>
  );
}
