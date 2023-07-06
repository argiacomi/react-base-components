import styled from '@styles';
import { Box, Stack, Text } from '@components';

const BoxStyled = styled(Box)(({ theme, ownerState }) => ({
  '&:hover': {
    backgroundColor: theme.color.primary.body,
    opacity: 0.6
  }
}));

function BoxComponent() {
  return (
    <Box
      component='span'
      sx={{ padding: 2, border: '1px', borderStyle: 'dashed', borderColor: 'gray' }}
    >
      Save
    </Box>
  );
}

export default function BoxDemo() {
  return (
    <Stack spacing={5} direction='column'>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Styling Props</Text>
        <BoxStyled width={300} height={300} backgroundColor='primary.600' />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Style Override</Text>
        <BoxComponent width={300} height={300} backgroundColor='primary.600' />
      </Stack>
    </Stack>
  );
}
