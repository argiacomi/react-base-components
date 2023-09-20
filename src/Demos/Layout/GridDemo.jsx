import { Box, Grid, Paper, Stack, Text } from '@components';
import styled, { useTheme } from '@styles';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.color.white,
  '@media (prefers-color-scheme: dark)': {
    backgroundColor: '#1A2027'
  },
  ...theme.text.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.color.text.secondary
}));

function BasicGrid() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid xs={8}>
          <Item>xs=8</Item>
        </Grid>
        <Grid xs={4}>
          <Item>xs=4</Item>
        </Grid>
        <Grid xs={4}>
          <Item>xs=4</Item>
        </Grid>
        <Grid xs={8}>
          <Item>xs=8</Item>
        </Grid>
      </Grid>
    </Box>
  );
}

function FullWidthGrid() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid xs={6} md={8}>
          <Item>xs=6 md=8</Item>
        </Grid>
        <Grid xs={6} md={4}>
          <Item>xs=6 md=4</Item>
        </Grid>
        <Grid xs={6} md={4}>
          <Item>xs=6 md=4</Item>
        </Grid>
        <Grid xs={6} md={8}>
          <Item>xs=6 md=8</Item>
        </Grid>
      </Grid>
    </Box>
  );
}

function RowAndColumnSpacing() {
  return (
    <Box sx={{ width: '100%' }}>
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid xs={6}>
          <Item>1</Item>
        </Grid>
        <Grid xs={6}>
          <Item>2</Item>
        </Grid>
        <Grid xs={6}>
          <Item>3</Item>
        </Grid>
        <Grid xs={6}>
          <Item>4</Item>
        </Grid>
      </Grid>
    </Box>
  );
}

function ResponsiveGrid() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
        {Array.from(Array(6)).map((_, index) => (
          <Grid xs={2} sm={4} md={4} key={index}>
            <Item>xs=2</Item>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

function AutoGrid() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={3}>
        <Grid xs>
          <Item>xs</Item>
        </Grid>
        <Grid xs={6}>
          <Item>xs=6</Item>
        </Grid>
        <Grid xs>
          <Item>xs</Item>
        </Grid>
      </Grid>
    </Box>
  );
}

function VariableWidthGrid() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={3}>
        <Grid xs='auto'>
          <Item>variable width content</Item>
        </Grid>
        <Grid xs={6}>
          <Item>xs=6</Item>
        </Grid>
        <Grid xs>
          <Item>xs</Item>
        </Grid>
      </Grid>
    </Box>
  );
}

function NestedGrid() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid xs={12} md={5} lg={4}>
          <Item>Email subscribe section</Item>
        </Grid>
        <Grid container xs={12} md={7} lg={8} spacing={4}>
          <Grid xs={6} lg={3}>
            <Item>
              <Box id='category-a' sx={{ fontSize: '12px', textTransform: 'uppercase' }}>
                Category A
              </Box>
              <Box component='ul' aria-labelledby='category-a' sx={{ pl: 2 }}>
                <li>Link 1.1</li>
                <li>Link 1.2</li>
                <li>Link 1.3</li>
              </Box>
            </Item>
          </Grid>
          <Grid xs={6} lg={3}>
            <Item>
              <Box id='category-b' sx={{ fontSize: '12px', textTransform: 'uppercase' }}>
                Category B
              </Box>
              <Box component='ul' aria-labelledby='category-b' sx={{ pl: 2 }}>
                <li>Link 2.1</li>
                <li>Link 2.2</li>
                <li>Link 2.3</li>
              </Box>
            </Item>
          </Grid>
          <Grid xs={6} lg={3}>
            <Item>
              <Box id='category-c' sx={{ fontSize: '12px', textTransform: 'uppercase' }}>
                Category C
              </Box>
              <Box component='ul' aria-labelledby='category-c' sx={{ pl: 2 }}>
                <li>Link 3.1</li>
                <li>Link 3.2</li>
                <li>Link 3.3</li>
              </Box>
            </Item>
          </Grid>
          <Grid xs={6} lg={3}>
            <Item>
              <Box id='category-d' sx={{ fontSize: '12px', textTransform: 'uppercase' }}>
                Category D
              </Box>
              <Box component='ul' aria-labelledby='category-d' sx={{ pl: 2 }}>
                <li>Link 4.1</li>
                <li>Link 4.2</li>
                <li>Link 4.3</li>
              </Box>
            </Item>
          </Grid>
        </Grid>
        <Grid
          xs={12}
          container
          justifyContent='space-between'
          alignItems='center'
          flexDirection={{ xs: 'column', sm: 'row' }}
          sx={{ fontSize: '12px' }}
        >
          <Grid sx={{ order: { xs: 2, sm: 1 } }}>
            <Item>© Copyright</Item>
          </Grid>
          <Grid container columnSpacing={1} sx={{ order: { xs: 1, sm: 2 } }}>
            <Grid>
              <Item>Link A</Item>
            </Grid>
            <Grid>
              <Item>Link B</Item>
            </Grid>
            <Grid>
              <Item>Link C</Item>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}

function AnotherNestedGrid() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2} columns={24}>
        <Grid xs={8}>
          <Item>xs=8/24</Item>
        </Grid>
        <Grid container xs={16}>
          <Grid xs={12}>
            <Item>nested xs=12/24</Item>
          </Grid>
          <Grid xs={12}>
            <Item>nested xs=12/24</Item>
          </Grid>
        </Grid>
        <Grid xs={8}>
          <Item>xs=8/24</Item>
        </Grid>
        <Grid container xs={16} columns={12}>
          <Grid xs={6}>
            <Item>nested xs=6/12</Item>
          </Grid>
          <Grid xs={6}>
            <Item>nested xs=6/12</Item>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}

function ColumnsGrid() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2} columns={16}>
        <Grid xs={8}>
          <Item>xs=8</Item>
        </Grid>
        <Grid xs={8}>
          <Item>xs=8</Item>
        </Grid>
      </Grid>
    </Box>
  );
}

function OffsetGrid() {
  return (
    <Grid container spacing={3} sx={{ flexGrow: 1 }}>
      <Grid xs={6} xsOffset={3} md={2} mdOffset={0}>
        <Item>1</Item>
      </Grid>
      <Grid xs={4} md={2} mdOffset='auto'>
        <Item>2</Item>
      </Grid>
      <Grid xs={4} xsOffset={4} md={2} mdOffset={0}>
        <Item>3</Item>
      </Grid>
      <Grid xs md={6} mdOffset={2}>
        <Item>4</Item>
      </Grid>
    </Grid>
  );
}

const StyledBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
  width: 200,
  '& > div': {
    overflow: 'auto hidden',
    '&::-webkit-scrollbar': { height: 10, WebkitAppearance: 'none' },
    '&::-webkit-scrollbar-thumb': {
      borderRadius: 8,
      border: '2px solid',
      borderColor: '#E7EBF0',
      '@media (prefers-color-scheme: dark)': {
        borderColor: ''
      },
      backgroundColor: 'rgba(0 0 0 / 0.5)'
    }
  }
}));

function AnotherAutoGrid() {
  return (
    <StyledBox>
      <div>
        <Grid container spacing={3}>
          <Grid xs={12}>
            <Item m='5px'> Scroll bar appears</Item>
          </Grid>
        </Grid>
      </div>
      <div>
        <Grid container spacing={3} disableEqualOverflow>
          <Grid xs={12}>
            <Item>`disableEqualOverflow` prevents scrollbar</Item>
          </Grid>
        </Grid>
      </div>
    </StyledBox>
  );
}

function FullBorderedGrid() {
  return (
    <Box sx={{ flexGrow: 1, p: 2 }}>
      <Grid
        container
        spacing={2}
        css={{
          '--Grid-borderWidth': '1px',
          borderTop: 'var(--Grid-borderWidth) solid',
          borderLeft: 'var(--Grid-borderWidth) solid',
          borderColor: 'divider',
          '& > div': {
            borderRight: 'var(--Grid-borderWidth) solid',
            borderBottom: 'var(--Grid-borderWidth) solid',
            borderColor: 'divider'
          }
        }}
      >
        {[...Array(6)].map((_, index) => (
          <Grid key={index} {...{ xs: 12, sm: 6, md: 4, lg: 3 }} minHeight={160} />
        ))}
      </Grid>
    </Box>
  );
}

function HalfBorderedGrid() {
  const theme = useTheme();
  const colWidth = { xs: 12, sm: 6, md: 4, lg: 3 };
  return (
    <Box sx={{ flexGrow: 1, p: 2 }}>
      <Grid
        container
        spacing={2}
        css={{
          '--Grid-borderWidth': '1px',
          borderTop: 'var(--Grid-borderWidth) solid',
          borderColor: 'divider',
          '& > div': {
            borderRight: 'var(--Grid-borderWidth) solid',
            borderBottom: 'var(--Grid-borderWidth) solid',
            borderColor: 'divider',
            ...Object.keys(colWidth).reduce(
              (result, key) => ({
                ...result,
                [`&:nth-of-type(${12 / colWidth[key]}n)`]: {
                  [theme.breakpoints.only(key)]: {
                    borderRight: 'none'
                  }
                }
              }),
              {}
            )
          }
        }}
      >
        {[...Array(6)].map((_, index) => (
          <Grid key={index} {...colWidth} minHeight={160} />
        ))}
      </Grid>
    </Box>
  );
}

export default function GridDemo() {
  return (
    <Stack spacing={5} direction='column'>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Basic Grid</Text>
        <BasicGrid />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Multiple breakpoints</Text>
        <FullWidthGrid />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Row and Column Spacing</Text>
        <RowAndColumnSpacing />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Responsive Grid</Text>
        <ResponsiveGrid />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Auto-layout Grid</Text>
        <AutoGrid />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Variable width content Grid</Text>
        <VariableWidthGrid />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Nested Grid</Text>
        <NestedGrid />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Inheriting Columns</Text>
        <AnotherNestedGrid />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Columns Grid</Text>
        <ColumnsGrid />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Offset Grid</Text>
        <OffsetGrid />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Disable the Scrollbar</Text>
        <AnotherAutoGrid />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Full Bordered Grid</Text>
        <FullBorderedGrid />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Half Bordered Grid</Text>
        <HalfBorderedGrid />
      </Stack>
    </Stack>
  );
}
