import { css } from 'styled-components/macro'; //eslint-disable-line
import { Alert, Stack } from '@components';

export default function DescriptionAlerts() {
  const variants = ['standard', 'outlined', 'filled'];
  const severities = ['success', 'info', 'warning', 'danger'];

  return (
    <Stack css={{ margin: '2rem 0', width: '100%' }} spacing={2}>
      {variants.map((variant, i) => {
        return severities.map((severity, j) => {
          return (
            <Alert key={`${i}-${j}`} variant={variant} severity={severity}>
              This is a {severity} alert with {variant} variant — <strong>check it out!</strong>
            </Alert>
          );
        });
      })}
    </Stack>
  );
}
