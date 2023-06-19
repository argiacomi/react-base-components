import * as React from 'react';
import { styled } from '@styles';
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
  ListItemText,
  ListItemIcon,
  Menu,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  Stack,
  Text,
  Tooltip,
  Zoom
} from '@components';

function BasicMenu() {
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
        id='basic-button'
        variant='filled'
        color='primary'
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup='true'
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        Dashboard
      </Button>
      <Menu
        id='basic-menu'
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button'
        }}
      >
        <MenuItem onClick={handleClose}>Profile</MenuItem>
        <MenuItem onClick={handleClose}>My account</MenuItem>
        <MenuItem onClick={handleClose}>Logout</MenuItem>
      </Menu>
    </div>
  );
}

function IconMenu() {
  return (
    <Paper css={{ width: 320, maxWidth: '100%' }}>
      <MenuList>
        <MenuItem>
          <ListItemIcon>
            <Icon icon='MdContentCut' fontSize='small' />
          </ListItemIcon>
          <ListItemText>Cut</ListItemText>
          <Text variant='body2' color='text.secondary'>
            ⌘X
          </Text>
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <Icon icon='MdContentCopy' fontSize='small' />
          </ListItemIcon>
          <ListItemText>Copy</ListItemText>
          <Text variant='body2' color='text.secondary'>
            ⌘C
          </Text>
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <Icon icon='MdContentPaste' fontSize='small' />
          </ListItemIcon>
          <ListItemText>Paste</ListItemText>
          <Text variant='body2' color='text.secondary'>
            ⌘V
          </Text>
        </MenuItem>
        <Divider />
        <MenuItem>
          <ListItemIcon>
            <Icon icon='MdCloud' fontSize='small' />
          </ListItemIcon>
          <ListItemText>Web Clipboard</ListItemText>
        </MenuItem>
      </MenuList>
    </Paper>
  );
}

function DenseMenu() {
  return (
    <Paper css={{ width: 320 }}>
      <MenuList dense>
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
      </MenuList>
    </Paper>
  );
}

const options = [
  'Show some love to Drew',
  'Show all notification content',
  'Hide sensitive notification content',
  'Hide all notification content'
];

function SimpleListMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedIndex, setSelectedIndex] = React.useState(1);
  const open = Boolean(anchorEl);
  const handleClickListItem = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuItemClick = (event, index) => {
    setSelectedIndex(index);
    setAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box css={{ width: 320 }}>
      <List
        component='nav'
        aria-label='Device settings'
        css={({ theme }) => ({ backgroundColor: theme.color.background })}
      >
        <ListItem
          button
          id='lock-button'
          aria-haspopup='listbox'
          aria-controls='lock-menu'
          aria-label='when device is locked'
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClickListItem}
        >
          <ListItemText primary='When device is locked' secondary={options[selectedIndex]} />
        </ListItem>
      </List>
      <Menu
        id='lock-menu'
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'lock-button',
          role: 'listbox'
        }}
      >
        {options.map((option, index) => (
          <MenuItem
            key={option}
            disabled={index === 0}
            selected={index === selectedIndex}
            onClick={(event) => handleMenuItemClick(event, index)}
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
    <Box css={{ width: 320 }}>
      <Button
        variant='filled'
        color='primary'
        id='demo-positioned-button'
        aria-controls={open ? 'demo-positioned-menu' : undefined}
        aria-haspopup='true'
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
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
    </Box>
  );
}

function MenuListComposition() {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);

  const handleToggle = () => {
    setOpen((prev) => !prev);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  function handleListKeyDown(event) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === 'Escape') {
      setOpen(false);
    }
  }

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
      <Paper>
        <MenuList>
          <MenuItem>Profile</MenuItem>
          <MenuItem>My account</MenuItem>
          <MenuItem>Logout</MenuItem>
        </MenuList>
      </Paper>
      <div>
        <Popper
          open={open}
          anchorEl={anchorRef.current}
          placement={'bottom-center'}
          popperOptions={{ offset: 0, arrow: { width: 20 } }}
          role={undefined}
          transition='Grow'
          // disableArrow
          disablePortal
        >
          <Paper>
            <ClickAwayListener onClickAway={handleClose}>
              <MenuList
                autoFocusItem={open}
                id='composition-menu'
                aria-labelledby='composition-button'
                onKeyDown={handleListKeyDown}
              >
                <MenuItem onClick={handleClose}>Profile</MenuItem>
                <MenuItem onClick={handleClose}>My account</MenuItem>
                <MenuItem onClick={handleClose}>Logout</MenuItem>
              </MenuList>
            </ClickAwayListener>
          </Paper>
        </Popper>
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
      <Box css={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
        <Text css={{ minWidth: 100 }}>Contact</Text>
        <Text css={{ minWidth: 100 }}>Profile</Text>
        <Tooltip title='Account settings'>
          <IconButton
            onClick={handleClick}
            size='small'
            css={{ marginLeft: '1rem' }}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup='true'
            aria-expanded={open ? 'true' : undefined}
          >
            <Avatar css={{ width: 32, height: 32 }}>M</Avatar>
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id='account-menu'
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          css: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            marginTop: '.75rem',
            '& .Avatar-Root': {
              width: 32,
              height: 32,
              marginLeft: '-0.25rem',
              marginRight: '.5rem'
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0
            }
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        disablePortal
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
            <Icon icon='MdPersonAdd' fontSize='small' />
          </ListItemIcon>
          Add another account
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Icon icon='MdSettings' fontSize='small' />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Icon icon='MdLogout' fontSize='small' />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right'
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right'
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .Paper-Root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color: theme.color.mode === 'light' ? 'rgb(55, 65, 81)' : theme.color.gray[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .Menu-List': {
      padding: '4px 0'
    },
    '& .MenuItem-Root': {
      '& .Icon-Root': {
        fontSize: 18,
        color: theme.color.text.secondary,
        marginRight: theme.spacing(1.5)
      },
      '&:active': {
        backgroundColor: theme.alpha.add(theme.color.primary.body, 0.12)
      }
    }
  }
}));

function CustomizedMenus() {
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
        id='demo-customized-button'
        aria-controls={open ? 'demo-customized-menu' : undefined}
        aria-haspopup='true'
        aria-expanded={open ? 'true' : undefined}
        variant='contained'
        disableElevation
        onClick={handleClick}
        endIcon='MdKeyboardArrowDown'
      >
        Options
      </Button>
      <StyledMenu
        id='demo-customized-menu'
        MenuListProps={{
          'aria-labelledby': 'demo-customized-button'
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose} disableRipple>
          <Icon icon='MdEdit' />
          Edit
        </MenuItem>
        <MenuItem onClick={handleClose} disableRipple>
          <Icon icon='MdFileCopy' />
          Duplicate
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />
        <MenuItem onClick={handleClose} disableRipple>
          <Icon icon='MdArchive' />
          Archive
        </MenuItem>
        <MenuItem onClick={handleClose} disableRipple>
          <Icon icon='MdMoreHoriz' />
          More
        </MenuItem>
      </StyledMenu>
    </div>
  );
}

const longOptions = [
  'None',
  'Atria',
  'Callisto',
  'Dione',
  'Ganymede',
  'Hangouts Call',
  'Luna',
  'Oberon',
  'Phobos',
  'Pyxis',
  'Sedna',
  'Titania',
  'Triton',
  'Umbriel'
];

const ITEM_HEIGHT = 48;

function LongMenu() {
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
      <IconButton
        aria-label='more'
        id='long-button'
        aria-controls={open ? 'long-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup='true'
        onClick={handleClick}
      >
        <Icon icon='MdMoreVert' />
      </IconButton>
      <Menu
        id='long-menu'
        MenuListProps={{
          'aria-labelledby': 'long-button'
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: '20ch'
          }
        }}
      >
        {longOptions.map((option) => (
          <MenuItem key={option} selected={option === 'Pyxis'} onClick={handleClose}>
            {option}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}

function TextMenu() {
  return (
    <Paper css={{ width: 230 }}>
      <MenuList>
        <MenuItem>
          <ListItemIcon>
            <Icon icon='MdSend' fontSize='small' />
          </ListItemIcon>
          <Text variant='inherit'>A short message</Text>
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <Icon icon='MdPriorityHigh' fontSize='small' />
          </ListItemIcon>
          <Text variant='inherit'>A very long text that overflows</Text>
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <Icon icon='MdDrafts' fontSize='small' />
          </ListItemIcon>
          <Text variant='inherit' noWrap>
            A very long text that overflows
          </Text>
        </MenuItem>
      </MenuList>
    </Paper>
  );
}

function ZoomMenu() {
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
        id='fade-button'
        aria-controls={open ? 'fade-menu' : undefined}
        aria-haspopup='true'
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        Dashboard
      </Button>
      <Menu
        id='fade-menu'
        MenuListProps={{
          'aria-labelledby': 'fade-button'
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        TransitionComponent={Zoom}
      >
        <MenuItem onClick={handleClose}>Profile</MenuItem>
        <MenuItem onClick={handleClose}>My account</MenuItem>
        <MenuItem onClick={handleClose}>Logout</MenuItem>
      </Menu>
    </div>
  );
}

export default function MenuDemo() {
  return (
    <Stack spacing={5} direction='column'>
      <Stack spacing={1} direction='column'>
        <Text variant='h6'>Basic Menu</Text>
        <BasicMenu />
      </Stack>
      <Stack spacing={1} direction='column'>
        <Text variant='h6'>Icon Menu</Text>
        <IconMenu />
      </Stack>
      <Stack spacing={1} direction='column'>
        <Text variant='h6'>Dense Menu</Text>
        <DenseMenu />
      </Stack>
      <Stack spacing={1} direction='column'>
        <Text variant='h6'>Selected Menu</Text>
        <SimpleListMenu />
      </Stack>
      <Stack spacing={1} direction='column'>
        <Text variant='h6'>Positioned Menu</Text>
        <PositionedMenu />
      </Stack>
      <Stack spacing={1} direction='column'>
        <Text variant='h6'>MenuList Composition</Text>
        <MenuListComposition />
      </Stack>
      <Stack spacing={1} direction='column'>
        <Text variant='h6'>Account Menu</Text>
        <AccountMenu />
      </Stack>
      <Stack spacing={1} direction='column'>
        <Text variant='h6'>Customized Menu</Text>
        <CustomizedMenus />
      </Stack>
      <Stack spacing={1} direction='column'>
        <Text variant='h6'>Max Height Menu</Text>
        <LongMenu />
      </Stack>
      <Stack spacing={1} direction='column'>
        <Text variant='h6'>{`Known Issue (& Workaround)`}</Text>
        <TextMenu />
      </Stack>
      <Stack spacing={1} direction='column'>
        <Text variant='h6'>Other Transitions</Text>
        <ZoomMenu />
      </Stack>
    </Stack>
  );
}
