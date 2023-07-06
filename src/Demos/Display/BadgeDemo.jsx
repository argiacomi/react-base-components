import React from 'react';
import { styled, css } from 'styled-components/macro'; //eslint-disable-line
import {
  Badge,
  Box,
  ButtonGroup,
  Button,
  Icon,
  IconButton,
  Stack,
  Switch,
  Text
} from '@components';

const MailIcon = (props) => <Icon icon='MdMail' {...props} />;

function SimpleBadge() {
  return (
    <Badge width={24} color='primary' badgeContent={4}>
      <Icon icon='MdMail' />
    </Badge>
  );
}

function ColorBadge() {
  return (
    <Stack spacing={2} direction='row'>
      <Badge badgeContent={4} color='secondary'>
        <MailIcon />
      </Badge>
      <Badge badgeContent={4} color='success'>
        <MailIcon />
      </Badge>
    </Stack>
  );
}

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .Badge-Badge': {
    right: -3,
    top: 13,
    border: `2px solid ${theme.color.background}`,
    padding: '0 4px'
  }
}));

function CustomizedBadges() {
  return (
    <IconButton aria-label='cart'>
      <StyledBadge badgeContent={4} color='secondary'>
        <Icon icon='MdShoppingCart' />
      </StyledBadge>
    </IconButton>
  );
}

function BadgeVisibility() {
  const [count, setCount] = React.useState(1);
  const [invisible, setInvisible] = React.useState(false);

  const handleBadgeVisibility = () => {
    setInvisible(!invisible);
  };

  return (
    <Box
      css={{
        display: 'flex',
        flexDirection: 'column',
        '& > *': {
          marginBottom: '1rem'
        },
        '& .Badge-Root': {
          marginRight: '2rem'
        }
      }}
    >
      <Stack direction='row' spacing={1}>
        <Badge color='secondary' badgeContent={count}>
          <Icon icon='MdMail' />
        </Badge>
        <ButtonGroup>
          <Button
            aria-label='reduce'
            onClick={() => {
              setCount(Math.max(count - 1, 0));
            }}
          >
            <Icon icon='MdRemove' fontSize='small' />
          </Button>
          <Button
            aria-label='increase'
            onClick={() => {
              setCount(count + 1);
            }}
          >
            <Icon icon='MdAdd' fontSize='small' />
          </Button>
        </ButtonGroup>
      </Stack>
      <Stack direction='row' spacing={1}>
        <Badge color='secondary' variant='dot' invisible={invisible}>
          <Icon icon='MdMail' />
        </Badge>
        <Switch checked={!invisible} onChange={handleBadgeVisibility} />
        <Text>Show Badge</Text>
      </Stack>
    </Box>
  );
}

function BadgeMax() {
  return (
    <Stack spacing={4} direction='row' sx={{ color: 'active' }}>
      <Badge color='secondary' badgeContent={99}>
        <MailIcon />
      </Badge>
      <Badge color='secondary' badgeContent={100}>
        <MailIcon />
      </Badge>
      <Badge color='secondary' badgeContent={1000} max={999}>
        <MailIcon />
      </Badge>
    </Stack>
  );
}

export default function BadgeDemo() {
  return (
    <Stack spacing={5} direction='column'>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Simple Badge</Text>
        <SimpleBadge />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Color Badge</Text>
        <ColorBadge />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Customized Badge</Text>
        <CustomizedBadges />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Badge Visibility</Text>
        <BadgeVisibility />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Maximum Values</Text>
        <BadgeMax />
      </Stack>
    </Stack>
  );
}
