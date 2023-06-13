import React from 'react';
import { styled } from '@styles';
import {
  Avatar,
  Box,
  Checkbox,
  Collapse,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Divider,
  Icon,
  IconButton,
  Paper,
  Stack,
  Switch,
  Text,
  Tooltip
} from '@components';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { FixedSizeList } from 'react-window';

function BasicList() {
  return (
    <Box
      css={({ theme }) => ({
        width: '100%',
        maxWidth: 350,
        backgroundColor: theme.color.background
      })}
    >
      <nav aria-label='main mailbox folders'>
        <List>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <Icon icon='MdInbox' />
              </ListItemIcon>
              <ListItemText primary='Inbox' />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <Icon icon='MdDrafts' />
              </ListItemIcon>
              <ListItemText primary='Drafts' />
            </ListItemButton>
          </ListItem>
        </List>
      </nav>
      <Divider />
      <nav aria-label='secondary mailbox folders'>
        <List>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemText primary='Trash' />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component='a' href='#simple-list'>
              <ListItemText primary='Spam' />
            </ListItemButton>
          </ListItem>
        </List>
      </nav>
    </Box>
  );
}

function NestedList() {
  const [open, setOpen] = React.useState(true);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <List
      css={({ theme }) => ({
        width: '100%',
        maxWidth: 350,
        backgroundColor: theme.color.background
      })}
      component='nav'
      aria-labelledby='nested-list-subheader'
      subheader={
        <ListSubheader component='div' id='nested-list-subheader'>
          Nested List Items
        </ListSubheader>
      }
    >
      <ListItemButton>
        <ListItemIcon>
          <Icon icon='MdSend' />
        </ListItemIcon>
        <ListItemText primary='Sent mail' />
      </ListItemButton>
      <ListItemButton>
        <ListItemIcon>
          <Icon icon='MdDrafts' />
        </ListItemIcon>
        <ListItemText primary='Drafts' />
      </ListItemButton>
      <ListItemButton onClick={handleClick}>
        <ListItemIcon>
          <Icon icon='MdInbox' />
        </ListItemIcon>
        <ListItemText primary='Inbox' />
        {open ? <Icon icon='MdExpandLess' /> : <Icon icon='MdExpandMore' />}
      </ListItemButton>
      <Collapse in={open} timeout='auto' unmountOnExit>
        <List component='div' disablePadding>
          <ListItemButton className='Drew' style={{ paddingLeft: '2rem' }}>
            <ListItemIcon>
              <Icon icon='MdStarBorder' />
            </ListItemIcon>
            <ListItemText primary='Starred' />
          </ListItemButton>
        </List>
      </Collapse>
    </List>
  );
}

function FolderList() {
  return (
    <List
      css={({ theme }) => ({
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.color.background
      })}
    >
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <Icon icon='MdImage' />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary='Photos' secondary='Jan 9, 2014' />
      </ListItem>
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <Icon icon='MdWork' />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary='Work' secondary='Jan 7, 2014' />
      </ListItem>
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

function generate(element) {
  return [0, 1, 2].map((value) =>
    React.cloneElement(element, {
      key: value
    })
  );
}

const Demo = styled('div')(({ theme }) => ({
  backgroundColor: theme.color.background
}));

function InteractiveList() {
  const [dense, setDense] = React.useState(false);
  const [secondary, setSecondary] = React.useState(false);

  return (
    <Box css={{ flexGrow: 1, maxWidth: 752 }}>
      <FormGroup row>
        <FormControlLabel
          control={
            <Checkbox checked={dense} onChange={(event) => setDense(event.target.checked)} />
          }
          label='Enable dense'
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={secondary}
              onChange={(event) => setSecondary(event.target.checked)}
            />
          }
          label='Enable secondary text'
        />
      </FormGroup>
      <Grid container spacing={2}>
        <Grid xs={12} md={6}>
          <Text css={{ marginTop: '2rem', marginBottom: '1rem' }} variant='h6' component='div'>
            Text only
          </Text>
          <Demo>
            <List dense={dense}>
              {generate(
                <ListItem>
                  <ListItemText
                    primary='Single-line item'
                    secondary={secondary ? 'Secondary text' : null}
                  />
                </ListItem>
              )}
            </List>
          </Demo>
        </Grid>
        <Grid xs={12} md={6}>
          <Text css={{ marginTop: '2rem', marginBottom: '1rem' }} variant='h6' component='div'>
            Icon with text
          </Text>
          <Demo>
            <List dense={dense}>
              {generate(
                <ListItem>
                  <ListItemIcon>
                    <Icon icon='MdFolder' />
                  </ListItemIcon>
                  <ListItemText
                    primary='Single-line item'
                    secondary={secondary ? 'Secondary text' : null}
                  />
                </ListItem>
              )}
            </List>
          </Demo>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid xs={12} md={6}>
          <Text css={{ marginTop: '2rem', marginBottom: '1rem' }} variant='h6' component='div'>
            Avatar with text
          </Text>
          <Demo>
            <List dense={dense}>
              {generate(
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <Icon icon='MdFolder' />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary='Single-line item'
                    secondary={secondary ? 'Secondary text' : null}
                  />
                </ListItem>
              )}
            </List>
          </Demo>
        </Grid>
        <Grid xs={12} md={6}>
          <Text css={{ marginTop: '2rem', marginBottom: '1rem' }} variant='h6' component='div'>
            Avatar with text and icon
          </Text>
          <Demo>
            <List dense={dense}>
              {generate(
                <ListItem
                  secondaryAction={
                    <IconButton edge='end' aria-label='delete'>
                      <Icon icon='MdDelete' />
                    </IconButton>
                  }
                >
                  <ListItemAvatar>
                    <Avatar>
                      <Icon icon='MdFolder' />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary='Single-line item'
                    secondary={secondary ? 'Secondary text' : null}
                  />
                </ListItem>
              )}
            </List>
          </Demo>
        </Grid>
      </Grid>
    </Box>
  );
}

function SelectedListItem() {
  const [selectedIndex, setSelectedIndex] = React.useState(1);

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };

  return (
    <Box
      css={({ theme }) => ({
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.color.background
      })}
    >
      <List component='nav' aria-label='main mailbox folders'>
        <ListItemButton
          selected={selectedIndex === 0}
          onClick={(event) => handleListItemClick(event, 0)}
        >
          <ListItemIcon>
            <Icon icon='MdInbox' />
          </ListItemIcon>
          <ListItemText primary='Inbox' />
        </ListItemButton>
        <ListItemButton
          selected={selectedIndex === 1}
          onClick={(event) => handleListItemClick(event, 1)}
        >
          <ListItemIcon>
            <Icon icon='MdDrafts' />
          </ListItemIcon>
          <ListItemText primary='Drafts' />
        </ListItemButton>
      </List>
      <Divider />
      <List component='nav' aria-label='secondary mailbox folder'>
        <ListItemButton
          selected={selectedIndex === 2}
          onClick={(event) => handleListItemClick(event, 2)}
        >
          <ListItemText primary='Trash' />
        </ListItemButton>
        <ListItemButton
          selected={selectedIndex === 3}
          onClick={(event) => handleListItemClick(event, 3)}
        >
          <ListItemText primary='Spam' />
        </ListItemButton>
      </List>
    </Box>
  );
}

function AlignItemsList() {
  return (
    <List
      css={({ theme }) => ({
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.color.background
      })}
    >
      <ListItem css={{ alignItems: 'flex-start' }}>
        <ListItemAvatar>
          <Avatar alt='Remy Sharp' src='/static/images/avatar/1.jpg' />
        </ListItemAvatar>
        <ListItemText
          primary='Brunch this weekend?'
          secondary={
            <React.Fragment>
              <Text css={{ display: 'inline' }} component='span' variant='body2' color='primary'>
                Ali Connors
              </Text>
              {" — I'll be in your neighborhood doing errands this…"}
            </React.Fragment>
          }
        />
      </ListItem>
      <Divider variant='inset' component='li' />
      <ListItem css={{ alignItems: 'flex-start' }}>
        <ListItemAvatar>
          <Avatar alt='Travis Howard' src='/static/images/avatar/2.jpg' />
        </ListItemAvatar>
        <ListItemText
          primary='Summer BBQ'
          secondary={
            <React.Fragment>
              <Text css={{ display: 'inline' }} component='span' variant='body2' color='primary'>
                to Scott, Alex, Jennifer
              </Text>
              {" — Wish I could come, but I'm out of town this…"}
            </React.Fragment>
          }
        />
      </ListItem>
      <Divider variant='inset' component='li' />
      <ListItem css={{ alignItems: 'flex-start' }}>
        <ListItemAvatar>
          <Avatar alt='Cindy Baker' src='/static/images/avatar/3.jpg' />
        </ListItemAvatar>
        <ListItemText
          primary='Oui Oui'
          secondary={
            <React.Fragment>
              <Text css={{ display: 'inline' }} component='span' variant='body2' color='primary'>
                Sandra Adams
              </Text>
              {' — Do you have Paris recommendations? Have you ever…'}
            </React.Fragment>
          }
        />
      </ListItem>
    </List>
  );
}

function CheckboxList() {
  const [checked, setChecked] = React.useState([0]);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  return (
    <List
      css={({ theme }) => ({
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.color.background
      })}
    >
      {[0, 1, 2, 3].map((value) => {
        const labelId = `checkbox-list-label-${value}`;

        return (
          <ListItem
            key={value}
            secondaryAction={<IconButton edge='end' aria-label='comments' icon='MdComment' />}
            disablePadding
          >
            <ListItemButton role={undefined} onClick={handleToggle(value)} dense>
              <ListItemIcon>
                <Checkbox
                  edge='start'
                  checked={checked.indexOf(value) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ 'aria-labelledby': labelId }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={`Line item ${value + 1}`} />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
}

function CheckboxListSecondary() {
  const [checked, setChecked] = React.useState([1]);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  return (
    <List
      dense
      css={({ theme }) => ({
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.color.background
      })}
    >
      {[0, 1, 2, 3].map((value) => {
        const labelId = `checkbox-list-secondary-label-${value}`;
        return (
          <ListItem
            key={value}
            secondaryAction={
              <Checkbox
                edge='end'
                onChange={handleToggle(value)}
                checked={checked.indexOf(value) !== -1}
                inputProps={{ 'aria-labelledby': labelId }}
              />
            }
            disablePadding
          >
            <ListItemButton>
              <ListItemAvatar>
                <Avatar
                  alt={`Avatar n°${value + 1}`}
                  src={`/static/images/avatar/${value + 1}.jpg`}
                />
              </ListItemAvatar>
              <ListItemText id={labelId} primary={`Line item ${value + 1}`} />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
}

function SwitchListSecondary() {
  const [checked, setChecked] = React.useState(['wifi']);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  return (
    <List
      css={({ theme }) => ({
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.color.background
      })}
      subheader={<ListSubheader>Settings</ListSubheader>}
    >
      <ListItem>
        <ListItemIcon>
          <Icon icon='MdWifi' />
        </ListItemIcon>
        <ListItemText id='switch-list-label-wifi' primary='Wi-Fi' />
        <Switch
          edge='end'
          onChange={handleToggle('wifi')}
          checked={checked.indexOf('wifi') !== -1}
          inputProps={{
            'aria-labelledby': 'switch-list-label-wifi'
          }}
        />
      </ListItem>
      <ListItem>
        <ListItemIcon>
          <Icon icon='MdBluetooth' />
        </ListItemIcon>
        <ListItemText id='switch-list-label-bluetooth' primary='Bluetooth' />
        <Switch
          edge='end'
          onChange={handleToggle('bluetooth')}
          checked={checked.indexOf('bluetooth') !== -1}
          inputProps={{
            'aria-labelledby': 'switch-list-label-bluetooth'
          }}
        />
      </ListItem>
    </List>
  );
}

function PinnedSubheaderList() {
  return (
    <List
      css={({ theme }) => ({
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.color.background,
        position: 'relative',
        overflow: 'auto',
        maxHeight: 300,
        '& ul': { padding: 0 }
      })}
      subheader={<li />}
    >
      {[0, 1, 2, 3, 4].map((sectionId) => (
        <li key={`section-${sectionId}`}>
          <ul>
            <ListSubheader>{`I'm sticky ${sectionId}`}</ListSubheader>
            {[0, 1, 2].map((item) => (
              <ListItem key={`item-${sectionId}-${item}`}>
                <ListItemText primary={`Item ${item}`} />
              </ListItem>
            ))}
          </ul>
        </li>
      ))}
    </List>
  );
}

function InsetList() {
  return (
    <List
      css={({ theme }) => ({
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.color.background
      })}
      aria-label='contacts'
    >
      <ListItem disablePadding>
        <ListItemButton>
          <ListItemIcon>
            <Icon icon='MdStar' />
          </ListItemIcon>
          <ListItemText primary='Chelsea Otakan' />
        </ListItemButton>
      </ListItem>
      <ListItem disablePadding>
        <ListItemButton>
          <ListItemText inset primary='Eric Hoffman' />
        </ListItemButton>
      </ListItem>
    </List>
  );
}

function renderRow(props) {
  const { index, style } = props;

  return (
    <ListItem style={style} key={index} component='div' disablePadding>
      <ListItemButton>
        <ListItemText primary={`Item ${index + 1}`} />
      </ListItemButton>
    </ListItem>
  );
}

function VirtualizedList() {
  return (
    <Box
      css={({ theme }) => ({
        height: 400,
        maxWidth: 360,
        backgroundColor: theme.color.background
      })}
    >
      <FixedSizeList height={400} width={360} itemSize={50} itemCount={500} overscanCount={5}>
        {renderRow}
      </FixedSizeList>
    </Box>
  );
}

const data = [
  { icon: <Icon icon='MdPeople' />, label: 'Authentication' },
  { icon: <Icon icon='MdDns' />, label: 'Database' },
  { icon: <Icon icon='MdPermMedia' />, label: 'Storage' },
  { icon: <Icon icon='MdPublic' />, label: 'Hosting' }
];

const FireNav = styled(List)({
  '& .MuiListItemButton-root': {
    paddingLeft: 24,
    paddingRight: 24
  },
  '& .MuiListItemIcon-root': {
    minWidth: 0,
    marginRight: 16
  },
  '& .MuiSvgIcon-root': {
    fontSize: 20
  }
});

function CustomizedList() {
  const [open, setOpen] = React.useState(true);
  return (
    <Box css={{ display: 'flex' }}>
      <Paper elevation={0} css={{ maxWidth: 256 }}>
        <FireNav component='nav' disablePadding>
          <ListItemButton component='a' href='#customized-list'>
            <ListItemIcon css={{ fontSize: 20 }}>🔥</ListItemIcon>
            <ListItemText
              css={{ marginTop: 0, marginBottom: 0 }}
              primary='Firebash'
              primaryTypographyProps={{
                fontSize: 20,
                fontWeight: 'medium',
                letterSpacing: 0
              }}
            />
          </ListItemButton>
          <Divider />
          <ListItem component='div' disablePadding>
            <ListItemButton css={{ height: 56 }}>
              <ListItemIcon>
                <Icon icon='MdHome' color='primary' />
              </ListItemIcon>
              <ListItemText
                primary='Project Overview'
                primaryTypographyProps={{
                  color: 'primary',
                  fontWeight: 'medium',
                  variant: 'body2'
                }}
              />
            </ListItemButton>
            <Tooltip title='Project Settings'>
              <IconButton
                size='large'
                css={{
                  '& svg': {
                    color: 'rgba(255,255,255,0.8)',
                    transition: '0.2s',
                    transform: 'translateX(0) rotate(0)'
                  },
                  '&:hover, &:focus': {
                    backgroundColor: 'unset',
                    '& svg:first-of-type': {
                      transform: 'translateX(-4px) rotate(-20deg)'
                    },
                    '& svg:last-of-type': {
                      right: 0,
                      opacity: 1
                    }
                  },
                  '&:after': {
                    content: '""',
                    position: 'absolute',
                    height: '80%',
                    display: 'block',
                    left: 0,
                    width: '1px',
                    backgroundColor: 'divider'
                  }
                }}
              >
                <Icon icon='MdSettings' />
                <Icon icon='MdArrowRight' css={{ position: 'absolute', right: 4, opacity: 0 }} />
              </IconButton>
            </Tooltip>
          </ListItem>
          <Divider />
          <Box
            css={{
              backgroundColor: open ? 'rgba(71, 98, 130, 0.2)' : null,
              paddingBottom: open ? 2 : 0
            }}
          >
            <ListItemButton
              alignItems='flex-start'
              onClick={() => setOpen(!open)}
              css={{
                paddingLeft: 3,
                paddingRight: 3,
                paddingTop: 2.5,
                paddingBottom: open ? 0 : 2.5,
                '&:hover, &:focus': { '& svg': { opacity: open ? 1 : 0 } }
              }}
            >
              <ListItemText
                primary='Build'
                primaryTypographyProps={{
                  fontSize: 15,
                  fontWeight: 'medium',
                  lineHeight: '20px',
                  marginBottom: '2px'
                }}
                secondary='Authentication, Firestore Database, Realtime Database, Storage, Hosting, Functions, and Machine Learning'
                secondaryTypographyProps={{
                  noWrap: true,
                  fontSize: 12,
                  lineHeight: '16px',
                  color: open ? 'rgba(0,0,0,0)' : 'rgba(255,255,255,0.5)'
                }}
                css={{ marginTop: 0, marginBottom: 0 }}
              />
              <Icon
                icon='MdKeyboardArrowDown'
                css={{
                  mrarginRight: '-1rem',
                  opacity: 0,
                  transform: open ? 'rotate(-180deg)' : 'rotate(0)',
                  transition: '0.2s'
                }}
              />
            </ListItemButton>
            {open &&
              data.map((item) => (
                <ListItemButton
                  key={item.label}
                  css={{
                    paddingTop: 0,
                    paddingBottom: 0,
                    minHeight: 32,
                    color: 'rgba(255,255,255,.8)'
                  }}
                >
                  <ListItemIcon sx={{ color: 'inherit' }}>{item.icon}</ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{ fontSize: 14, fontWeight: 'medium' }}
                  />
                </ListItemButton>
              ))}
          </Box>
        </FireNav>
      </Paper>
    </Box>
  );
}

export default function ListDemo() {
  return (
    <Stack spacing={2} direction='column'>
      <BasicList />
      <NestedList />
      <FolderList />
      <InteractiveList />
      <SelectedListItem />
      <AlignItemsList />
      <CheckboxList />
      <CheckboxListSecondary />
      <SwitchListSecondary />
      <PinnedSubheaderList />
      <InsetList />
      <VirtualizedList />
      <CustomizedList />
    </Stack>
  );
}
