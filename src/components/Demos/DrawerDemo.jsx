import React from 'react';
import styled from '@styles';
import {
  AppBar,
  Box,
  Button,
  Divider,
  Drawer,
  Icon,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Skeleton,
  Stack,
  SwipeDrawer,
  Text,
  Toolbar
} from '@components';

function SwipeTemporaryDrawer() {
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const list = (anchor) => (
    <Box
      css={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
      role='presentation'
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <Icon icon='MdInbox' /> : <Icon icon='MdMail' />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {['All mail', 'Trash', 'Spam'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <Icon icon='MdInbox' /> : <Icon icon='MdMail' />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <div>
      {['left', 'right', 'top', 'bottom'].map((anchor) => (
        <React.Fragment key={anchor}>
          <Button onClick={toggleDrawer(anchor, true)}>{anchor}</Button>
          <SwipeDrawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
            onOpen={toggleDrawer(anchor, true)}
          >
            {list(anchor)}
          </SwipeDrawer>
        </React.Fragment>
      ))}
    </div>
  );
}

const drawerBleeding = 56;

const Root = styled('div')({
  height: '100%'
});

const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.color.mode === 'light' ? '#fff' : theme.color.gray[800]
}));

const Puller = styled(Box)(({ theme }) => ({
  width: 30,
  height: 6,
  backgroundColor: theme.color.mode === 'light' ? theme.color.gray[300] : theme.color.gray[900],
  borderRadius: 3,
  position: 'absolute',
  top: 8,
  left: 'calc(50% - 15px)'
}));

function SwipeEdgeDrawer(props) {
  const { window } = props;
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Root
      css={{
        ['.Drawer-Root > .Paper-Root']: {
          height: `calc(50% - ${drawerBleeding}px)`,
          overflow: 'visible'
        }
      }}
    >
      <Box css={{ textAlign: 'center', paddingTop: '.5rem' }}>
        <Button variant='outlined' color='primary' onClick={toggleDrawer(true)}>
          {open ? 'Close' : 'Open'}
        </Button>
      </Box>
      <SwipeDrawer
        disablePortal
        container={container}
        anchor='bottom'
        open={open}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
        swipeAreaWidth={drawerBleeding}
        disableSwipeToOpen={false}
        ModalProps={{
          keepMounted: true
        }}
      >
        <StyledBox
          css={{
            position: 'absolute',
            top: -drawerBleeding,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            visibility: 'visible',
            right: 0,
            left: 0
          }}
        >
          <Puller />
          <Text css={{ padding: '1rem', color: 'text.secondary' }}>51 results</Text>
        </StyledBox>
        <StyledBox
          css={{
            padding: '0 1rem 1rem',
            height: '100%',
            overflow: 'auto'
          }}
        >
          <Skeleton variant='rectangular' height='100%' />
        </StyledBox>
      </SwipeDrawer>
    </Root>
  );
}

const drawerWidth = 240;

function ResponsiveDrawer(props) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const handleClick = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <Icon icon='MdInbox' /> : <Icon icon='MdMail' />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {['All mail', 'Trash', 'Spam'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <Icon icon='MdInbox' /> : <Icon icon='MdMail' />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <>
      <Button variant='outlined' color='primary' onClick={handleClick}>
        {sidebarOpen ? 'Close' : 'Open'}
      </Button>
      {sidebarOpen && (
        <Box css={{ display: 'flex' }}>
          <AppBar
            position='fixed'
            css={({ theme }) => ({
              [theme.breakpoints.up('sm')]: {
                width: `calc(100% - ${drawerWidth}px)`,
                marginLeft: `${drawerWidth}px`
              }
            })}
          >
            <Toolbar>
              <IconButton
                color='inherit'
                aria-label='open drawer'
                edge='start'
                onClick={handleDrawerToggle}
                css={({ theme }) => ({
                  marginRight: '1rem',
                  [theme.breakpoints.up('sm')]: { display: 'none' }
                })}
              >
                <Icon icon='MdMenu' />
              </IconButton>
              <Text variant='h6' noWrap component='div'>
                Responsive drawer
              </Text>
            </Toolbar>
          </AppBar>
          <Box
            component='nav'
            css={({ theme }) => ({
              [theme.breakpoints.up('sm')]: {
                width: drawerWidth,
                flexShrink: 0
              }
            })}
            aria-label='mailbox folders'
          >
            {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
            <Drawer
              container={container}
              variant='temporary'
              open={mobileOpen}
              onClose={handleDrawerToggle}
              ModalProps={{
                keepMounted: true // Better open performance on mobile.
              }}
              css={({ theme }) => ({
                [theme.breakpoints.up('xs')]: {
                  display: 'block'
                },
                [theme.breakpoints.up('sm')]: {
                  display: 'none'
                },
                ['& .Drawer-Paper']: { boxSizing: 'border-box', width: drawerWidth }
              })}
            >
              {drawer}
            </Drawer>
            <Drawer
              variant='permanent'
              css={({ theme }) => ({
                [theme.breakpoints.up('xs')]: {
                  display: 'none'
                },
                [theme.breakpoints.up('sm')]: {
                  display: 'block'
                },
                ['& .Drawer-Paper']: { boxSizing: 'border-box', width: drawerWidth }
              })}
              open
            >
              {drawer}
            </Drawer>
          </Box>
          <Box
            component='main'
            css={({ theme }) => ({
              flexGrow: 1,
              padding: '1.5rem',
              [theme.breakpoints.up('sm')]: {
                width: `calc(100% - ${drawerWidth}px)`
              }
            })}
          >
            <Toolbar />
            <Text paragraph>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Rhoncus dolor purus non enim praesent
              elementum facilisis leo vel. Risus at ultrices mi tempus imperdiet. Semper risus in
              hendrerit gravida rutrum quisque non tellus. Convallis convallis tellus id interdum
              velit laoreet id donec ultrices. Odio morbi quis commodo odio aenean sed adipiscing.
              Amet nisl suscipit adipiscing bibendum est ultricies integer quis. Cursus euismod quis
              viverra nibh cras. Metus vulputate eu scelerisque felis imperdiet proin fermentum leo.
              Mauris commodo quis imperdiet massa tincidunt. Cras tincidunt lobortis feugiat vivamus
              at augue. At augue eget arcu dictum varius duis at consectetur lorem. Velit sed
              ullamcorper morbi tincidunt. Lorem donec massa sapien faucibus et molestie ac.
            </Text>
            <Text paragraph>
              Consequat mauris nunc congue nisi vitae suscipit. Fringilla est ullamcorper eget nulla
              facilisi etiam dignissim diam. Pulvinar elementum integer enim neque volutpat ac
              tincidunt. Ornare suspendisse sed nisi lacus sed viverra tellus. Purus sit amet
              volutpat consequat mauris. Elementum eu facilisis sed odio morbi. Euismod lacinia at
              quis risus sed vulputate odio. Morbi tincidunt ornare massa eget egestas purus viverra
              accumsan in. In hendrerit gravida rutrum quisque non tellus orci ac. Pellentesque nec
              nam aliquam sem et tortor. Habitant morbi tristique senectus et. Adipiscing elit duis
              tristique sollicitudin nibh sit. Ornare aenean euismod elementum nisi quis eleifend.
              Commodo viverra maecenas accumsan lacus vel facilisis. Nulla posuere sollicitudin
              aliquam ultrices sagittis orci a.
            </Text>
          </Box>
        </Box>
      )}
    </>
  );
}

// !Persistent Drawer

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transition.create('margin', {
      easing: theme.transition.easing.sharp,
      duration: theme.transition.duration.leavingScreen
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transition.create('margin', {
        easing: theme.transition.easing.easeOut,
        duration: theme.transition.duration.enteringScreen
      }),
      marginLeft: 0
    })
  })
);

const StyledAppBar = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== 'open'
})(({ theme, open }) => ({
  transition: theme.transition.create(['margin', 'width'], {
    easing: theme.transition.easing.sharp,
    duration: theme.transition.duration.leavingScreen
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transition.create(['margin', 'width'], {
      easing: theme.transition.easing.easeOut,
      duration: theme.transition.duration.enteringScreen
    })
  })
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0) + ' ' + theme.spacing(1),
  justifyContent: 'flex-end'
}));

function PersistentDrawer() {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const handleClick = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button variant='outlined' color='primary' onClick={handleClick}>
        {sidebarOpen ? 'Close' : 'Open'}
      </Button>
      {sidebarOpen && (
        <Box css={{ display: 'flex' }}>
          <StyledAppBar position='fixed' open={open}>
            <Toolbar>
              <IconButton
                color='inherit'
                aria-label='open drawer'
                onClick={handleDrawerOpen}
                edge='start'
                css={{ marginRight: '1rem', ...(open && { display: 'none' }) }}
                icon='MdMenu'
              />
              <Text variant='h6' noWrap component='div'>
                Persistent drawer
              </Text>
            </Toolbar>
          </StyledAppBar>
          <Drawer
            css={{
              width: drawerWidth,
              flexShrink: 0,
              '& .Drawer-Paper': {
                width: drawerWidth,
                boxSizing: 'border-box'
              }
            }}
            variant='persistent'
            anchor='left'
            open={open}
          >
            <DrawerHeader>
              <IconButton onClick={handleDrawerClose} icon='MdChevronLeft' />
            </DrawerHeader>
            <Divider />
            <List>
              {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
                <ListItem key={text} disablePadding>
                  <ListItemButton>
                    <ListItemIcon>
                      {index % 2 === 0 ? <Icon icon='MdInbox' /> : <Icon icon='MdMail' />}
                    </ListItemIcon>
                    <ListItemText primary={text} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
            <Divider />
            <List>
              {['All mail', 'Trash', 'Spam'].map((text, index) => (
                <ListItem key={text} disablePadding>
                  <ListItemButton>
                    <ListItemIcon>
                      {index % 2 === 0 ? <Icon icon='MdInbox' /> : <Icon icon='MdMail' />}
                    </ListItemIcon>
                    <ListItemText primary={text} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Drawer>
          <Main open={open}>
            <DrawerHeader />
            <Text paragraph>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Rhoncus dolor purus non enim praesent
              elementum facilisis leo vel. Risus at ultrices mi tempus imperdiet. Semper risus in
              hendrerit gravida rutrum quisque non tellus. Convallis convallis tellus id interdum
              velit laoreet id donec ultrices. Odio morbi quis commodo odio aenean sed adipiscing.
              Amet nisl suscipit adipiscing bibendum est ultricies integer quis. Cursus euismod quis
              viverra nibh cras. Metus vulputate eu scelerisque felis imperdiet proin fermentum leo.
              Mauris commodo quis imperdiet massa tincidunt. Cras tincidunt lobortis feugiat vivamus
              at augue. At augue eget arcu dictum varius duis at consectetur lorem. Velit sed
              ullamcorper morbi tincidunt. Lorem donec massa sapien faucibus et molestie ac.
            </Text>
            <Text paragraph>
              Consequat mauris nunc congue nisi vitae suscipit. Fringilla est ullamcorper eget nulla
              facilisi etiam dignissim diam. Pulvinar elementum integer enim neque volutpat ac
              tincidunt. Ornare suspendisse sed nisi lacus sed viverra tellus. Purus sit amet
              volutpat consequat mauris. Elementum eu facilisis sed odio morbi. Euismod lacinia at
              quis risus sed vulputate odio. Morbi tincidunt ornare massa eget egestas purus viverra
              accumsan in. In hendrerit gravida rutrum quisque non tellus orci ac. Pellentesque nec
              nam aliquam sem et tortor. Habitant morbi tristique senectus et. Adipiscing elit duis
              tristique sollicitudin nibh sit. Ornare aenean euismod elementum nisi quis eleifend.
              Commodo viverra maecenas accumsan lacus vel facilisis. Nulla posuere sollicitudin
              aliquam ultrices sagittis orci a.
            </Text>
          </Main>
        </Box>
      )}
    </>
  );
}

// !Persistent Drawer with Icons

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transition.create('width', {
    easing: theme.transition.easing.sharp,
    duration: theme.transition.duration.enteringScreen
  }),
  overflowX: 'hidden'
});

const closedMixin = (theme) => ({
  transition: theme.transition.create('width', {
    easing: theme.transition.easing.sharp,
    duration: theme.transition.duration.leavingScreen
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`
  }
});

const DrawerHeaderTwo = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  minHeight: theme.spacing(8)
}));

const StyledAppBarTwo = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== 'open'
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transition.create(['width', 'margin'], {
    easing: theme.transition.easing.sharp,
    duration: theme.transition.duration.leavingScreen
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transition.create(['width', 'margin'], {
      easing: theme.transition.easing.sharp,
      duration: theme.transition.duration.enteringScreen
    })
  })
}));

const StyledDrawer = styled(Drawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .Drawer-Paper': openedMixin(theme)
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .Drawer-Paper': closedMixin(theme)
    })
  })
);

function MiniDrawer() {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const handleClick = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button variant='outlined' color='primary' onClick={handleClick}>
        {sidebarOpen ? 'Close' : 'Open'}
      </Button>
      {sidebarOpen && (
        <Box css={{ display: 'flex' }}>
          <StyledAppBarTwo position='fixed' open={open}>
            <Toolbar>
              <IconButton
                color='inherit'
                aria-label='open drawer'
                onClick={handleDrawerOpen}
                edge='start'
                css={{
                  marginRight: 5,
                  ...(open && { display: 'none' })
                }}
                icon='MdMenu'
              />
              <Text variant='h6' noWrap component='div'>
                Mini variant drawer
              </Text>
            </Toolbar>
          </StyledAppBarTwo>
          <StyledDrawer variant='permanent' open={open}>
            <DrawerHeaderTwo>
              <IconButton onClick={handleDrawerClose} icon='MdChevronLeft' />
            </DrawerHeaderTwo>
            <Divider />
            <List>
              {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
                <ListItem key={text} disablePadding css={{ display: 'block' }}>
                  <ListItemButton
                    css={{
                      minHeight: 48,
                      justifyContent: open ? 'initial' : 'center'
                    }}
                  >
                    <ListItemIcon
                      css={{
                        minWidth: 0,
                        marginRight: open ? 3 : 'auto',
                        justifyContent: 'center'
                      }}
                    >
                      {index % 2 === 0 ? <Icon icon='MdInbox' /> : <Icon icon='MdMail' />}
                    </ListItemIcon>
                    <ListItemText primary={text} css={{ opacity: open ? 1 : 0 }} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
            <Divider />
            <List>
              {['All mail', 'Trash', 'Spam'].map((text, index) => (
                <ListItem key={text} disablePadding css={{ display: 'block' }}>
                  <ListItemButton
                    css={{
                      minHeight: 48,
                      justifyContent: open ? 'initial' : 'center'
                    }}
                  >
                    <ListItemIcon
                      css={{
                        minWidth: 0,
                        marginRight: open ? 3 : 'auto',
                        justifyContent: 'center'
                      }}
                    >
                      {index % 2 === 0 ? <Icon icon='MdInbox' /> : <Icon icon='MdMail' />}
                    </ListItemIcon>
                    <ListItemText primary={text} css={{ opacity: open ? 1 : 0 }} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </StyledDrawer>
          <Box component='main' css={{ flexGrow: 1, padding: 3 }}>
            <DrawerHeaderTwo />
            <Text paragraph>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Rhoncus dolor purus non enim praesent
              elementum facilisis leo vel. Risus at ultrices mi tempus imperdiet. Semper risus in
              hendrerit gravida rutrum quisque non tellus. Convallis convallis tellus id interdum
              velit laoreet id donec ultrices. Odio morbi quis commodo odio aenean sed adipiscing.
              Amet nisl suscipit adipiscing bibendum est ultricies integer quis. Cursus euismod quis
              viverra nibh cras. Metus vulputate eu scelerisque felis imperdiet proin fermentum leo.
              Mauris commodo quis imperdiet massa tincidunt. Cras tincidunt lobortis feugiat vivamus
              at augue. At augue eget arcu dictum varius duis at consectetur lorem. Velit sed
              ullamcorper morbi tincidunt. Lorem donec massa sapien faucibus et molestie ac.
            </Text>
            <Text paragraph>
              Consequat mauris nunc congue nisi vitae suscipit. Fringilla est ullamcorper eget nulla
              facilisi etiam dignissim diam. Pulvinar elementum integer enim neque volutpat ac
              tincidunt. Ornare suspendisse sed nisi lacus sed viverra tellus. Purus sit amet
              volutpat consequat mauris. Elementum eu facilisis sed odio morbi. Euismod lacinia at
              quis risus sed vulputate odio. Morbi tincidunt ornare massa eget egestas purus viverra
              accumsan in. In hendrerit gravida rutrum quisque non tellus orci ac. Pellentesque nec
              nam aliquam sem et tortor. Habitant morbi tristique senectus et. Adipiscing elit duis
              tristique sollicitudin nibh sit. Ornare aenean euismod elementum nisi quis eleifend.
              Commodo viverra maecenas accumsan lacus vel facilisis. Nulla posuere sollicitudin
              aliquam ultrices sagittis orci a.
            </Text>
          </Box>
        </Box>
      )}
    </>
  );
}

export default function DrawerDemo() {
  return (
    <Stack
      spacing={2}
      direction='column'
      css={{ marginLeft: 'auto', marginRight: 'auto', maxWidth: 800, marginBottom: '2rem' }}
    >
      <Text variant='h6'>Swiper or Click:</Text>
      <SwipeTemporaryDrawer />
      <SwipeEdgeDrawer />
      <ResponsiveDrawer />
      <PersistentDrawer />
      <MiniDrawer />
    </Stack>
  );
}
