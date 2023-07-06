import { Box, Stack, Text } from '@components';
import styled from '@styles';

function Types() {
  return (
    <Box swidth='100%' maxWidth={500}>
      <Text variant='h1' gutterBottom>
        h1. Heading
      </Text>
      <Text variant='h2' gutterBottom>
        h2. Heading
      </Text>
      <Text variant='h3' gutterBottom>
        h3. Heading
      </Text>
      <Text variant='h4' gutterBottom>
        h4. Heading
      </Text>
      <Text variant='h5' gutterBottom>
        h5. Heading
      </Text>
      <Text variant='h6' gutterBottom>
        h6. Heading
      </Text>
      <Text variant='subtitle1' gutterBottom>
        subtitle1. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur
      </Text>
      <Text variant='subtitle2' gutterBottom>
        subtitle2. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur
      </Text>
      <Text variant='body1' gutterBottom>
        body1. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur
        unde suscipit, quam beatae rerum inventore consectetur, neque doloribus, cupiditate numquam
        dignissimos laborum fugiat deleniti? Eum quasi quidem quibusdam.
      </Text>
      <Text variant='body2' gutterBottom>
        body2. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur
        unde suscipit, quam beatae rerum inventore consectetur, neque doloribus, cupiditate numquam
        dignissimos laborum fugiat deleniti? Eum quasi quidem quibusdam.
      </Text>
      <Text variant='button' display='block' gutterBottom>
        button text
      </Text>
      <Text variant='caption' display='block' gutterBottom>
        caption text
      </Text>
      <Text variant='overline' display='block' gutterBottom>
        overline text
      </Text>
    </Box>
  );
}

const Div = styled('div')(({ theme }) => ({
  ...theme.text.typography.button,
  backgroundColor: theme.color.background,
  padding: theme.spacing(1)
}));

function TextTheme() {
  return <Div>{"This div's text looks like that of a button."}</Div>;
}

function Elementchange() {
  return (
    <Text variant='h1' component='h2'>
      h1. Heading
    </Text>
  );
}

export default function TextDemo() {
  return (
    <Stack spacing={5} direction='column'>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Text Types</Text>
        <Types />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Text Theme</Text>
        <TextTheme />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Element Change</Text>
        <Elementchange />
      </Stack>
    </Stack>
  );
}
