import { Box, Grid, Paper, Stack, Text } from '@components';
import styled from '@styles';

function SimplePaper() {
  return (
    <Box
      css={{
        display: 'flex',
        flexWrap: 'wrap',
        '& > :not(style)': {
          margin: '.5rem',
          width: 128,
          height: 128
        }
      }}
    >
      <Paper elevation={0} />
      <Paper />
      <Paper elevation={3} />
    </Box>
  );
}

function Variants() {
  return (
    <Box
      css={{
        display: 'flex',
        '& > :not(style)': {
          margin: '.5rem',
          width: 128,
          height: 128
        }
      }}
    >
      <Paper outlined />
      <Paper outlined square />
    </Box>
  );
}

const Item = styled(Paper)(({ theme }) => ({
  ...theme.text.typography.body2,
  textAlign: 'center',
  color: theme.color.text.secondary,
  height: 60,
  lineHeight: '60px',
  margin: theme.spacing(1)
}));

function Elevation() {
  return (
    <Grid container spacing={2}>
      <Grid xs={6}>
        <Box
          sx={{
            maxWidth: 364,
            padding: '1rem',
            bgcolor: 'background.default',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 2
          }}
        >
          {[0, 1, 2, 3, 4, 6, 8, 12, 16, 24].map((elevation) => (
            <Item key={elevation} elevation={elevation}>
              {`elevation=${elevation}`}
            </Item>
          ))}
        </Box>
      </Grid>
    </Grid>
  );
}

export default function PaperDemo() {
  return (
    <Stack spacing={5} direction='column'>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Basic Paper</Text>
        <SimplePaper />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Paper Variants</Text>
        <Variants />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Elevation Variants</Text>
        <Elevation />
      </Stack>
    </Stack>
  );
}
