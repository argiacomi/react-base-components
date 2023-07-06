import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  Icon,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  Text
} from '@components';
import React from 'react';
import styled from '@styles';

const style = {
  width: '100%',
  maxWidth: 360,
  backgroundColor: 'background'
};

function ListDividers() {
  return (
    <List sx={style} component='nav' aria-label='mailbox folders'>
      <ListItem button>
        <ListItemText primary='Inbox' />
      </ListItem>
      <Divider />
      <ListItem button divider>
        <ListItemText primary='Drafts' />
      </ListItem>
      <ListItem button>
        <ListItemText primary='Trash' />
      </ListItem>
      <Divider />
      <ListItem button>
        <ListItemText primary='Spam' />
      </ListItem>
    </List>
  );
}

function InsetDividers() {
  return (
    <List
      sx={{
        width: '100%',
        maxWidth: 360,
        backgroundColor: 'background'
      }}
    >
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <Icon icon='MdImage' />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary='Photos' secondary='Jan 9, 2014' />
      </ListItem>
      <Divider variant='inset' component='li' />
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <Icon icon='MdWork' />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary='Work' secondary='Jan 7, 2014' />
      </ListItem>
      <Divider variant='inset' component='li' />
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <Icon icon='MdBeachAccess' />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary='Vacation' secondary='July 20, 2014' />
      </ListItem>
    </List>
  );
}

function SubheaderDividers() {
  return (
    <List
      sx={{
        width: '100%',
        maxWidth: 360,
        backgroundColor: 'background'
      }}
    >
      <ListItem>
        <ListItemText primary='Photos' secondary='Jan 9, 2014' />
      </ListItem>
      <Divider component='li' />
      <li>
        <Text sx={{ mt: 0.5, ml: 2 }} color='text.secondary' display='block' variant='caption'>
          Divider
        </Text>
      </li>
      <ListItem>
        <ListItemText primary='Work' secondary='Jan 7, 2014' />
      </ListItem>
      <Divider component='li' variant='inset' />
      <li>
        <Text sx={{ mt: 0.5, ml: 9 }} color='text.secondary' display='block' variant='caption'>
          Leisure
        </Text>
      </li>
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <Icon icon='MdBeachAccess' />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary='Vacation' secondary='July 20, 2014' />
      </ListItem>
    </List>
  );
}

function MiddleDividers() {
  return (
    <Box sx={{ width: '100%', maxWidth: 360, backgroundColor: 'background' }}>
      <Box sx={{ my: 3, mx: 2 }}>
        <Grid container alignItems='center'>
          <Grid item xs>
            <Text gutterBottom variant='h4' component='div'>
              Toothbrush
            </Text>
          </Grid>
          <Grid item>
            <Text gutterBottom variant='h6' component='div'>
              $4.50
            </Text>
          </Grid>
        </Grid>
        <Text color='text.secondary' variant='body2'>
          Pinstriped cornflower blue cotton blouse takes you on a walk to the park or just down the
          hall.
        </Text>
      </Box>
      <Divider variant='middle' />
      <Box sx={{ m: 2 }}>
        <Text gutterBottom variant='body1'>
          Select type
        </Text>
        <Stack direction='row' spacing={1}>
          <Chip label='Extra Soft' />
          <Chip color='primary' label='Soft' />
          <Chip label='Medium' />
          <Chip label='Hard' />
        </Stack>
      </Box>
      <Box sx={{ mt: 3, ml: 1, mb: 1 }}>
        <Button>Add to cart</Button>
      </Box>
    </Box>
  );
}
const Root = styled('div')(({ theme }) => ({
  width: '100%',
  ...theme.text.typography.body2,
  '& > :not(style) + :not(style)': {
    marginTop: theme.spacing(2)
  }
}));

function DividerText() {
  const content = (
    <div>
      {`Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus id dignissim justo.
   Nulla ut facilisis ligula. Interdum et malesuada fames ac ante ipsum primis in faucibus.
   Sed malesuada lobortis pretium.`}
    </div>
  );

  return (
    <Root>
      {content}
      <Divider>CENTER</Divider>
      {content}
      <Divider textAlign='left'>LEFT</Divider>
      {content}
      <Divider textAlign='right'>RIGHT</Divider>
      {content}
      <Divider>
        <Chip label='CHIP' />
      </Divider>
      {content}
    </Root>
  );
}

function VerticalDividers() {
  return (
    <div>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          width: 'fit-content',
          border: 1,
          borderColor: 'divider',
          borderRadius: 1,
          backgroundColor: 'background',
          color: 'text.secondary',
          '& svg': {
            m: 1.5
          },
          '& hr': {
            mx: 0.5
          }
        }}
      >
        <Icon icon='MdFormatAlignLeft' />
        <Icon icon='MdFormatAlignCenter' />
        <Icon icon='MdFormatAlignRight' />
        <Divider orientation='vertical' flexItem />
        <Icon icon='MdFormatBold' />
        <Icon icon='MdFormatItalic' />
      </Box>
    </div>
  );
}

function VerticalDividerMiddle() {
  return (
    <div>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          width: 'fit-content',
          border: 1,
          borderColor: 'divider',
          borderRadius: 1,
          backgroundColor: 'background',
          color: 'text.secondary',
          '& svg': {
            m: 1.5
          },
          '& hr': {
            mx: 0.5
          }
        }}
      >
        <Icon icon='MdFormatAlignLeft' />
        <Icon icon='MdFormatAlignCenter' />
        <Icon icon='MdFormatAlignRight' />
        <Divider orientation='vertical' variant='middle' flexItem />
        <Icon icon='MdFormatBold' />
        <Icon icon='MdFormatItalic' />
      </Box>
    </div>
  );
}

const StyledGrid = styled(Grid)(({ theme }) => ({
  width: '100%',
  ...theme.text.typography.body2,
  '& [role="separator"]': {
    margin: theme.spacing(0, 2)
  }
}));

function VerticalDividerText() {
  const content = (
    <div>
      {`Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus id dignissim justo.
   Nulla ut facilisis ligula. Interdum et malesuada fames ac ante ipsum primis in faucibus.
   Sed malesuada lobortis pretium.`}
    </div>
  );

  return (
    <StyledGrid container>
      <StyledGrid xs>{content}</StyledGrid>
      <Divider orientation='vertical' flexItem>
        VERTICAL
      </Divider>
      <StyledGrid xs>{content}</StyledGrid>
    </StyledGrid>
  );
}

export default function DividerDemo() {
  return (
    <Stack spacing={5} direction='column'>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>List Dividers</Text>
        <ListDividers />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Inset Dividers</Text>
        <InsetDividers />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Subheader Dividers</Text>
        <SubheaderDividers />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Middle Dividers</Text>
        <MiddleDividers />
      </Stack>
      <Stack display='inline-block' spacing={1} direction='column' width={750}>
        <Text variant='h6'>Dividers with Text</Text>
        <DividerText />
      </Stack>
      <Stack display='inline-block' spacing={1} direction='column' width={750}>
        <Text variant='h6'>Vertical Dividers</Text>
        <VerticalDividers />
      </Stack>
      <Stack display='inline-block' spacing={1} direction='column' width={750}>
        <Text variant='h6'>Vertical with Variant</Text>
        <VerticalDividerMiddle />
      </Stack>
      <Stack display='inline-block' spacing={1} direction='column' width={750}>
        <Text variant='h6'>Vertical with Text</Text>
        <VerticalDividerText />
      </Stack>
      <Stack display='inline-block' spacing={1} direction='column' width={750}></Stack>
    </Stack>
  );
}
