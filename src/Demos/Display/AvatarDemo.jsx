import styled, { css } from 'styled-components/macro'; //eslint-disable-line
import { Avatar, AvatarGroup, Badge, Icon, Stack, Text } from '@components';

function ImageAvatars() {
  return (
    <Stack direction='row' spacing={2}>
      <Avatar alt='Remy Sharp' src='/static/images/avatar/1.jpg' />
      <Avatar alt='Travis Howard' src='/static/images/avatar/2.jpg' />
      <Avatar alt='Cindy Baker' src='/static/images/avatar/3.jpg' />
    </Stack>
  );
}

function LetterAvatars() {
  return (
    <Stack direction='row' spacing={2}>
      <Avatar>H</Avatar>
      <Avatar backgroundColor='warning.600'>N</Avatar>
      <Avatar backgroundColor='secondary.600'>OP</Avatar>
    </Stack>
  );
}

function stringToColor(string) {
  let hash = 0;
  let i;

  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

function stringAvatar(name) {
  return {
    backgroundColor: stringToColor(name),
    children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`
  };
}

function BackgroundLetterAvatars() {
  return (
    <Stack direction='row' spacing={2}>
      <Avatar {...stringAvatar('Kent Dodds')} />
      <Avatar {...stringAvatar('Jed Watson')} />
      <Avatar {...stringAvatar('Tim Neutkens')} />
    </Stack>
  );
}

function AvatarSizes() {
  return (
    <Stack direction='row' spacing={2}>
      <Avatar alt='Remy Sharp' src='/static/images/avatar/1.jpg' sx={{ width: 24, height: 24 }} />
      <Avatar alt='Remy Sharp' src='/static/images/avatar/1.jpg' />
      <Avatar alt='Remy Sharp' src='/static/images/avatar/1.jpg' sx={{ width: 56, height: 56 }} />
    </Stack>
  );
}

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .Badge-Badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.color.background}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""'
    }
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0
    }
  }
}));

function IconAvatars() {
  return (
    <Stack direction='row' spacing={2}>
      <Avatar>
        <Icon icon='MdFolder' />
      </Avatar>
      <Avatar backgroundColor='pink'>
        <Icon icon='MdPageview' />
      </Avatar>
      <Avatar backgroundColor='green'>
        <Icon icon='MdAssignment' />
      </Avatar>
    </Stack>
  );
}

function VariantAvatars() {
  return (
    <Stack direction='row' spacing={2}>
      <Avatar backgroundColor='orange' variant='square'>
        N
      </Avatar>
      <Avatar backgroundColor='green' variant='rounded'>
        <Icon icon='MdAssignment' />
      </Avatar>
    </Stack>
  );
}

function FallbackAvatars() {
  return (
    <Stack direction='row' spacing={2}>
      <Avatar backgroundColor='orange' alt='Remy Sharp' src='/broken-image.jpg'>
        B
      </Avatar>
      <Avatar backgroundColor='orange' alt='Remy Sharp' src='/broken-image.jpg' />
      <Avatar src='/broken-image.jpg' />
    </Stack>
  );
}

function GroupAvatars() {
  return (
    <AvatarGroup max={4}>
      <Avatar alt='Remy Sharp' src='/static/images/avatar/1.jpg' />
      <Avatar alt='Travis Howard' src='/static/images/avatar/2.jpg' />
      <Avatar alt='Cindy Baker' src='/static/images/avatar/3.jpg' />
      <Avatar alt='Agnes Walker' src='/static/images/avatar/4.jpg' />
      <Avatar alt='Trevor Henderson' src='/static/images/avatar/5.jpg' />
    </AvatarGroup>
  );
}

function TotalAvatars() {
  return (
    <AvatarGroup total={24}>
      <Avatar alt='Remy Sharp' src='/static/images/avatar/1.jpg' />
      <Avatar alt='Travis Howard' src='/static/images/avatar/2.jpg' />
      <Avatar alt='Agnes Walker' src='/static/images/avatar/4.jpg' />
      <Avatar alt='Trevor Henderson' src='/static/images/avatar/5.jpg' />
    </AvatarGroup>
  );
}

const SmallAvatar = styled(Avatar)(({ theme }) => ({
  width: 22,
  height: 22,
  border: `2px solid ${theme.color.white}`,
  padding: 0,
  '& .Badge-Badge': {
    padding: 0
  }
}));

function BadgeAvatars() {
  return (
    <Stack direction='row' spacing={2}>
      <StyledBadge
        overlap='circular'
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        variant='dot'
      >
        <Avatar alt='Remy Sharp' src='/static/images/avatar/1.jpg' />
      </StyledBadge>
      <Badge
        overlap='circular'
        className='drew'
        color='transparent'
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        badgeContent={<SmallAvatar padding={0} alt='Remy Sharp' />}
      >
        <Avatar alt='Travis Howard' src='/static/images/avatar/2.jpg' />
      </Badge>
    </Stack>
  );
}

export default function AvatartDemo() {
  return (
    <Stack spacing={5} direction='column'>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Image Avatars</Text>
        <ImageAvatars />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Letter Avatars</Text>
        <LetterAvatars />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>String to Color Avatars</Text>
        <BackgroundLetterAvatars />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Avatar Sizes</Text>
        <AvatarSizes />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Icon Avatars</Text>
        <IconAvatars />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Avatar Variants</Text>
        <VariantAvatars />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Broken Link Fallback</Text>
        <FallbackAvatars />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Grouped Avatars</Text>
        <GroupAvatars />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Avatar Count Overflow</Text>
        <TotalAvatars />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Avatars with Badges</Text>
        <BadgeAvatars />
      </Stack>
    </Stack>
  );
}
