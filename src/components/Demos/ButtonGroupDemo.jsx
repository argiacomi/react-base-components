import { css } from 'styled-components/macro'; //eslint-disable-line
import { Button, ButtonGroup, Box } from '@components';

const buttons = [
  <Button key='one'>One</Button>,
  <Button key='two'>Two</Button>,
  <Button key='three'>Three</Button>
];

export default function ButtonGroupDemo() {
  return (
    <Box
      css={{
        display: 'flex',
        '& > *': {
          margin: '1rem'
        }
      }}
    >
      <ButtonGroup orientation='vertical' aria-label='vertical outlined button group'>
        {buttons}
      </ButtonGroup>
      <ButtonGroup
        orientation='vertical'
        aria-label='vertical filled button group'
        variant='filled'
      >
        {buttons}
      </ButtonGroup>
      <ButtonGroup orientation='vertical' aria-label='vertical filled button group' variant='text'>
        {buttons}
      </ButtonGroup>
    </Box>
  );
}
