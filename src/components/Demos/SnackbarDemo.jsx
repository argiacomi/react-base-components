import * as React from 'react';
import { Button, SnackbarProvider, useSnackbarQueue } from '@components';

function MyApp() {
  const { addSnackbar } = useSnackbarQueue();

  const handleClick = () => {
    addSnackbar('I love snacks.');
  };

  const handleClickVariant = (variant) => () => {
    addSnackbar('This is a success message!', { variant });
  };

  return (
    <React.Fragment>
      <Button onClick={handleClick}>Show snackbar</Button>
      <Button onClick={handleClickVariant('success')}>Show success snackbar</Button>
    </React.Fragment>
  );
}

export default function IntegrationNotistack() {
  return (
    <SnackbarProvider maxSnack={3}>
      <MyApp />
    </SnackbarProvider>
  );
}
