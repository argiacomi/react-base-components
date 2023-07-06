import { Box, Container, Stack, Text } from '@components';

function SimpleContainer() {
  return (
    <Container height='500px'>
      <Box sx={{ backgroundColor: '#cfe8fc', height: 500 }} />
    </Container>
  );
}

function FixedContainer() {
  return (
    <Container fixed height='500px'>
      <Box sx={{ backgroundColor: '#cfe8fc', height: 500 }} />
    </Container>
  );
}

export default function ContainerDemo() {
  return (
    <Stack spacing={5} direction='column'>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Fluid Container</Text>
        <SimpleContainer />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Fixed Container</Text>
        <FixedContainer />
      </Stack>
    </Stack>
  );
}
