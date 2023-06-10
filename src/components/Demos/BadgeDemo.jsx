import React from 'react';
import { css } from 'styled-components/macro'; //eslint-disable-line
import { Badge, Box, ButtonGroup, Button, Icon, Stack, Switch, Text } from '@components';

export default function BadgeVisibility() {
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
