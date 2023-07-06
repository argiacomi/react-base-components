import { Box, Link, Stack, Text } from '@components';

const preventDefault = (event) => event.preventDefault();

function Links() {
  return (
    <Box
      css={{
        typography: 'body1',
        '& > :not(style) + :not(style)': {
          marginLeft: '1rem'
        }
      }}
      onClick={preventDefault}
    >
      <Link href='#'>Link</Link>
      <Link href='#' color='inherit'>
        {'color="inherit"'}
      </Link>
      <Link href='#' variant='body2'>
        {'variant="body2"'}
      </Link>
    </Box>
  );
}

function UnderlineLink() {
  return (
    <Box
      css={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'start',
        typography: 'body1',
        '& > :not(style) + :not(style)': {
          marginLeft: '1rem'
        }
      }}
      onClick={preventDefault}
    >
      <Link href='#' underline='none'>
        {'underline="none"'}
      </Link>
      <Link href='#' underline='hover'>
        {'underline="hover"'}
      </Link>
      <Link href='#' underline='always'>
        {'underline="always"'}
      </Link>
    </Box>
  );
}

export default function LinkDemo() {
  return (
    <Stack spacing={5} direction='column'>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Basic Links</Text>
        <Links />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Underlined Links</Text>
        <UnderlineLink />
      </Stack>
    </Stack>
  );
}
