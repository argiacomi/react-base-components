import { Stack, Text, TextareaAutosize, TextField } from '@components';
import styled from '@styles';

function UnstyledTextareaIntroduction(props) {
  return (
    <TextField
      aria-label='empty textarea'
      placeholder='Empty'
      {...props}
      slotProps={{
        input: { inputComponent: TextareaAutosize }
      }}
    />
  );
}

export default function PopperDemo() {
  return (
    <Stack width='fit-content' spacing={5} direction='column'>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Unstyled Textarea</Text>
        <UnstyledTextareaIntroduction minRows={4} maxRows={4} />
      </Stack>
    </Stack>
  );
}
