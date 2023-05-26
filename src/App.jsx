import * as React from 'react';
import {
  Box,
  Badge,
  ButtonGroup,
  Button,
  Checkbox,
  Icon,
  Switch
} from '@components';
import FormControlLabel from '@mui/material/FormControlLabel';

export default function BadgeVisibility() {
  const [count, setCount] = React.useState(1);
  const [invisible, setInvisible] = React.useState(false);

  const handleBadgeVisibility = () => {
    setInvisible(!invisible);
  };

  return (
    <Box
      css={{
        color: 'action.active',
        display: 'flex',
        flexDirection: 'column',
        '& > *': {
          marginBottom: 16
        },
        '& .MuiBadge-root': {
          marginRight: 32
        }
      }}
    >
      <div>
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
      </div>
      <div>
        <Badge color='secondary' variant='dot' invisible={invisible}>
          <Icon icon='MdMail' />
        </Badge>
        <FormControlLabel
          sx={{ color: 'text.primary' }}
          control={
            <Switch checked={!invisible} onChange={handleBadgeVisibility} />
          }
          label='Show Badge'
        />
      </div>
    </Box>
  );
}
