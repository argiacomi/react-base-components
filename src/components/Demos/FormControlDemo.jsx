import { css } from 'styled-components/macro'; //eslint-disable-line
import { , Stack, FormHelperText, Input, InputLabel } from '@components';

export default function FormControlDemo() {
  return (
    <Stack css={{ margin: '2rem 0', width: '350px' }} spacing={2}>
      <FormControl>
        <InputLabel htmlFor='my-input'>Email address</InputLabel>
        <Input id='my-input' aria-describedby='my-helper-text' />
        <FormHelperText id='my-helper-text'>{`We'll never share your email.`}</FormHelperText>
      </FormControl>
    </Stack>
  );
}
