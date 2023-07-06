import React from 'react';
import {
  Avatar,
  Box,
  Button,
  ClickAwayListener,
  Divider,
  Icon,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Popper,
  Stack,
  Text,
  Tooltip
} from '@components';
import { baseListActions } from '@BaseList';

function BasicMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const menuActions = React.useRef(null);
  const preventReopen = React.useRef(false);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const createHandleMenuClick = (menuItem) => {
    return () => {
      console.log(`Clicked on ${menuItem}`);
      setAnchorEl(null);
    };
  };

  const handleButtonMouseDown = () => {
    if (open) {
      preventReopen.current = true;
    }
  };

  const handleButtonKeyDown = (event) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      setAnchorEl(event.currentTarget);
      if (event.key === 'ArrowUp') {
        menuActions.current?.dispatch({
          type: baseListActions.keyDown,
          key: event.key,
          event
        });
      }
    }
  };

  return (
    <div>
      <Button
        id='basic-button'
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup='true'
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        onKeyDown={handleButtonKeyDown}
        onMouseDown={handleButtonMouseDown}
        variant='filled'
      >
        Dashboard
      </Button>
      <Menu
        id='basic-menu'
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          list: {
            'aria-labelledby': 'basic-button'
          }
        }}
      >
        <MenuItem onClick={createHandleMenuClick('Profile')}>Profile</MenuItem>
        <MenuItem onClick={createHandleMenuClick('My account')}>My Account</MenuItem>
        <MenuItem onClick={createHandleMenuClick('Log out')}>Log out</MenuItem>
      </Menu>
    </div>
  );
}

function IconMenu() {
  return (
    <Box width={320}>
      <Menu
        slots={{ root: Paper }}
        id='basic-menu'
        slotProps={{
          list: {
            'aria-labelledby': 'basic-button'
          }
        }}
      >
        <MenuItem>
          <ListItemIcon>
            <Icon icon='MdContentCut' size='small' />
          </ListItemIcon>
          <ListItemText>Cut</ListItemText>
          <Text variant='body2' color='text.secondary'>
            ⌘X
          </Text>
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <Icon icon='MdContentCopy' size='small' />
          </ListItemIcon>
          <ListItemText>Copy</ListItemText>
          <Text variant='body2' color='text.secondary'>
            ⌘C
          </Text>
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <Icon icon='MdContentPaste' size='small' />
          </ListItemIcon>
          <ListItemText>Paste</ListItemText>
          <Text variant='body2' color='text.secondary'>
            ⌘V
          </Text>
        </MenuItem>
        <Divider />
        <MenuItem>
          <ListItemIcon>
            <Icon icon='MdCloud' size='small' />
          </ListItemIcon>
          <ListItemText>Web Clipboard</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
}

function DenseMenu() {
  return (
    <Box width={320}>
      <Menu
        slots={{ root: Paper }}
        dense
        id='basic-menu'
        slotProps={{
          list: {
            'aria-labelledby': 'basic-button'
          }
        }}
      >
        <MenuItem>
          <ListItemText inset>Single</ListItemText>
        </MenuItem>
        <MenuItem>
          <ListItemText inset>1.15</ListItemText>
        </MenuItem>
        <MenuItem>
          <ListItemText inset>Double</ListItemText>
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <Icon icon='MdCheck' />
          </ListItemIcon>
          Custom: 1.2
        </MenuItem>
        <Divider />
        <MenuItem>
          <ListItemText>Add space before paragraph</ListItemText>
        </MenuItem>
        <MenuItem>
          <ListItemText>Add space after paragraph</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem>
          <ListItemText>Custom spacing...</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
}

const options = [
  'Show some love to Drew',
  'Show all notification content',
  'Hide sensitive notification content',
  'Hide all notification content'
];

function SelectedMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedIndex, setSelectedIndex] = React.useState(1);
  const open = Boolean(anchorEl);
  const menuActions = React.useRef(null);
  const preventReopen = React.useRef(false);

  const handleClick = (event) => {
    if (preventReopen.current) {
      event.preventDefault();
      preventReopen.current = false;
      return;
    }

    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const createHandleMenuClick = (event, index) => {
    setSelectedIndex(index);
    setAnchorEl(null);
  };

  const handleButtonMouseDown = () => {
    if (open) {
      preventReopen.current = true;
    }
  };

  const handleButtonKeyDown = (event) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      setAnchorEl(event.currentTarget);
      if (event.key === 'ArrowUp') {
        menuActions.current?.dispatch({
          type: baseListActions.keyDown,
          key: event.key,
          event
        });
      }
    }
  };

  return (
    <Box width='fit-content'>
      <List component='nav' aria-label='Device settings' sx={{ backgroundColor: 'background' }}>
        <ListItem
          button
          id='lock-button'
          aria-haspopup='listbox'
          aria-controls='lock-menu'
          aria-label='when device is locked'
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
          onKeyDown={handleButtonKeyDown}
          onMouseDown={handleButtonMouseDown}
        >
          <ListItemText primary='When device is locked' secondary={options[selectedIndex]} />
        </ListItem>
      </List>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          list: {
            'aria-labelledby': 'lock-button',
            role: 'listbox'
          }
        }}
        width={320}
      >
        {options.map((option, index) => (
          <MenuItem
            key={option}
            disabled={index === 0}
            selected={index === selectedIndex}
            onClick={(event) => createHandleMenuClick(event, index)}
          >
            {option}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
}

function PositionedMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        id='demo-positioned-button'
        aria-controls={open ? 'demo-positioned-menu' : undefined}
        aria-haspopup='true'
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        variant='filled'
      >
        Dashboard
      </Button>
      <Menu
        id='demo-positioned-menu'
        aria-labelledby='demo-positioned-button'
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
      >
        <MenuItem onClick={handleClose}>Profile</MenuItem>
        <MenuItem onClick={handleClose}>My account</MenuItem>
        <MenuItem onClick={handleClose}>Logout</MenuItem>
      </Menu>
    </div>
  );
}

function MenuListComposition() {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  return (
    <Stack direction='row' spacing={2}>
      <Menu slots={{ root: Paper }}>
        <MenuItem>Profile</MenuItem>
        <MenuItem>My account</MenuItem>
        <MenuItem>Logout</MenuItem>
      </Menu>
      <div>
        <Button
          ref={anchorRef}
          id='composition-button'
          aria-controls={open ? 'composition-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-haspopup='true'
          onClick={handleToggle}
        >
          Dashboard
        </Button>
        <Popper
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          placement='bottom-start'
          transition
          disablePortal
          disableArrow
          popperOptions={{ offset: false, flip: false, hide: false }}
        >
          <ClickAwayListener onClickAway={handleClose}>
            <Menu slots={{ root: Paper }}>
              <MenuItem>Profile</MenuItem>
              <MenuItem>My account</MenuItem>
              <MenuItem>Logout</MenuItem>
            </Menu>
          </ClickAwayListener>
        </Popper>
      </div>
    </Stack>
  );
}

function AccountMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <React.Fragment>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
        <Text sx={{ minWidth: 100 }}>Contact</Text>
        <Text sx={{ minWidth: 100 }}>Profile</Text>
        <Tooltip title='Account settings'>
          <IconButton
            onClick={handleClick}
            size='small'
            sx={{ ml: 2 }}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup='true'
            aria-expanded={open ? 'true' : undefined}
          >
            <Avatar sx={{ width: 32, height: 32 }}>M</Avatar>
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        arrow
        id='account-menu'
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        outlined
        slotProps={{
          popper: {
            elevation: 0
          }
        }}
        sx={{
          '& .Avatar-Root': {
            width: 32,
            height: 32,
            ml: -0.5,
            mr: 1,
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleClose}>
          <Avatar /> Profile
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <Avatar /> My account
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Icon icon='MdPersonAdd' size='small' />
          </ListItemIcon>
          Add another account
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Icon icon='MdSettings' size='small' />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Icon icon='MdLogout' size='small' />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}

export default function MenuDemo() {
  return (
    <Stack spacing={5} direction='column'>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Basic Menu</Text>
        <BasicMenu />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Icon Menu</Text>
        <IconMenu />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Dense Menu</Text>
        <DenseMenu />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Selected Menu</Text>
        <SelectedMenu />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Positioned Menu</Text>
        <PositionedMenu />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>MenuList Composition</Text>
        <MenuListComposition />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Account Menu</Text>
        <AccountMenu />
      </Stack>
    </Stack>
  );
}
