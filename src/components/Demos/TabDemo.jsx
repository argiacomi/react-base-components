import * as React from 'react';
import { Box, Icon, Stack, Tabs, Tab, Text } from '@components';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box css={{ padding: '1.5rem' }}>
          <Text>{children}</Text>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  };
}

function BasicTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box css={{ width: '100%' }}>
      <Box css={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label='basic tabs example'>
          <Tab label='Item One' {...a11yProps(0)} />
          <Tab label='Item Two' {...a11yProps(1)} />
          <Tab label='Item Three' {...a11yProps(2)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        Item One
      </TabPanel>
      <TabPanel value={value} index={1}>
        Item Two
      </TabPanel>
      <TabPanel value={value} index={2}>
        Item Three
      </TabPanel>
    </Box>
  );
}

function ColorTabs() {
  const [value, setValue] = React.useState('one');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box css={{ width: '100%' }}>
      <Tabs
        value={value}
        onChange={handleChange}
        textColor='secondary'
        indicatorColor='secondary'
        aria-label='secondary tabs example'
      >
        <Tab value='one' label='Item One' />
        <Tab value='two' label='Item Two' />
        <Tab value='three' label='Item Three' />
      </Tabs>
    </Box>
  );
}

function DisabledTabs() {
  const [value, setValue] = React.useState(2);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Tabs value={value} onChange={handleChange} aria-label='disabled tabs example'>
      <Tab label='Active' />
      <Tab label='Disabled' disabled />
      <Tab label='Active' />
    </Tabs>
  );
}

function CenteredTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box
      css={({ theme }) => ({
        width: '100%',
        backgroundColor: theme.color.background
      })}
    >
      <Tabs value={value} onChange={handleChange} centered>
        <Tab label='Item One' />
        <Tab label='Item Two' />
        <Tab label='Item Three' />
      </Tabs>
    </Box>
  );
}

function ScrollableTabsButtonAuto() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box
      css={({ theme }) => ({
        maxWidth: 320,
        [theme.breakpoints.up('sm')]: { maxWidth: 480 },
        backgroundColor: theme.color.background
      })}
    >
      <Tabs
        value={value}
        onChange={handleChange}
        variant='scrollable'
        scrollButtons='auto'
        aria-label='scrollable auto tabs example'
      >
        <Tab label='Item One' />
        <Tab label='Item Two' />
        <Tab label='Item Three' />
        <Tab label='Item Four' />
        <Tab label='Item Five' />
        <Tab label='Item Six' />
        <Tab label='Item Seven' />
      </Tabs>
    </Box>
  );
}

function ScrollableTabsButtonForce() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box
      css={({ theme }) => ({
        maxWidth: 320,
        [theme.breakpoints.up('sm')]: { maxWidth: 445 },
        backgroundColor: theme.color.background
      })}
    >
      <Tabs
        value={value}
        onChange={handleChange}
        variant='scrollable'
        scrollButtons
        allowScrollButtonsMobile
        aria-label='scrollable force tabs example'
      >
        <Tab label='Item One' />
        <Tab label='Item Two' />
        <Tab label='Item Three' />
        <Tab label='Item Four' />
        <Tab label='Item Five' />
        <Tab label='Item Six' />
        <Tab label='Item Seven' />
      </Tabs>
    </Box>
  );
}

function ScrollableTabsButtonPrevent() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box
      css={({ theme }) => ({
        maxWidth: 320,
        [theme.breakpoints.up('sm')]: { maxWidth: 445 },
        backgroundColor: theme.color.background
      })}
    >
      <Tabs
        value={value}
        onChange={handleChange}
        variant='scrollable'
        scrollButtons={false}
        aria-label='scrollable prevent tabs example'
      >
        <Tab label='Item One' />
        <Tab label='Item Two' />
        <Tab label='Item Three' />
        <Tab label='Item Four' />
        <Tab label='Item Five' />
        <Tab label='Item Six' />
        <Tab label='Item Seven' />
      </Tabs>
    </Box>
  );
}

function VerticalTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box
      css={({ theme }) => ({
        flexGrow: 1,
        backgroundColor: theme.color.background,
        display: 'flex',
        height: 224
      })}
    >
      <Tabs
        orientation='vertical'
        variant='scrollable'
        value={value}
        onChange={handleChange}
        aria-label='Vertical tabs example'
        sx={{ borderRight: 1, borderColor: 'divider' }}
      >
        <Tab label='Item One' {...a11yProps(0)} />
        <Tab label='Item Two' {...a11yProps(1)} />
        <Tab label='Item Three' {...a11yProps(2)} />
        <Tab label='Item Four' {...a11yProps(3)} />
        <Tab label='Item Five' {...a11yProps(4)} />
        <Tab label='Item Six' {...a11yProps(5)} />
        <Tab label='Item Seven' {...a11yProps(6)} />
      </Tabs>
      <TabPanel value={value} index={0}>
        Item One
      </TabPanel>
      <TabPanel value={value} index={1}>
        Item Two
      </TabPanel>
      <TabPanel value={value} index={2}>
        Item Three
      </TabPanel>
      <TabPanel value={value} index={3}>
        Item Four
      </TabPanel>
      <TabPanel value={value} index={4}>
        Item Five
      </TabPanel>
      <TabPanel value={value} index={5}>
        Item Six
      </TabPanel>
      <TabPanel value={value} index={6}>
        Item Seven
      </TabPanel>
    </Box>
  );
}

function LinkTab(props) {
  return (
    <Tab
      component='a'
      onClick={(event) => {
        event.preventDefault();
      }}
      {...props}
    />
  );
}

function NavTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs value={value} onChange={handleChange} aria-label='nav tabs example'>
        <LinkTab label='Page One' href='/drafts' />
        <LinkTab label='Page Two' href='/trash' />
        <LinkTab label='Page Three' href='/spam' />
      </Tabs>
    </Box>
  );
}

function IconTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Tabs value={value} onChange={handleChange} aria-label='icon tabs example'>
      <Tab icon={<Icon icon='MdPhone' />} aria-label='phone' />
      <Tab icon={<Icon icon='MdFavorite' />} aria-label='favorite' />
      <Tab icon={<Icon icon='MdPerson' />} aria-label='person' />
    </Tabs>
  );
}

function IconLabelTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Tabs value={value} onChange={handleChange} aria-label='icon label tabs example'>
      <Tab icon={<Icon icon='MdPhone' />} label='RECENTS' aria-label='phone' />
      <Tab icon={<Icon icon='MdFavorite' />} label='FAVORITES' aria-label='favorite' />
      <Tab icon={<Icon icon='MdPerson' />} label='NEARBY' aria-label='person' />
    </Tabs>
  );
}

function IconPositionTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Tabs value={value} onChange={handleChange} aria-label='icon position tabs example'>
      <Tab icon={<Icon icon='MdPhone' />} label='top' />
      <Tab icon={<Icon icon='MdPhone' />} iconPosition='start' label='start' />
      <Tab icon={<Icon icon='MdFavorite' />} iconPosition='end' label='end' />
      <Tab icon={<Icon icon='MdPerson' />} iconPosition='bottom' label='bottom' />
    </Tabs>
  );
}

function AccessibleTabs1() {
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box css={{ width: '100%' }}>
      <Tabs
        onChange={handleChange}
        value={value}
        aria-label='Tabs where selection follows focus'
        selectionFollowsFocus
      >
        <Tab label='Item One' />
        <Tab label='Item Two' />
        <Tab label='Item Three' />
      </Tabs>
    </Box>
  );
}

function AccessibleTabs2() {
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box css={{ width: '100%' }}>
      <Tabs
        onChange={handleChange}
        value={value}
        aria-label='Tabs where each tab needs to be selected manually'
      >
        <Tab label='Item One' />
        <Tab label='Item Two' />
        <Tab label='Item Three' />
      </Tabs>
    </Box>
  );
}

export default function TabDemo() {
  return (
    <Stack spacing={5} direction='column'>
      <Stack spacing={1} direction='column'>
        <Text variant='h6'>Basic Tabs</Text>
        <BasicTabs />
      </Stack>
      <Stack spacing={1} direction='column'>
        <Text variant='h6'>Color Tabs</Text>
        <ColorTabs />
      </Stack>
      <Stack spacing={1} direction='column'>
        <Text variant='h6'>Disabled Tabs</Text>
        <DisabledTabs />
      </Stack>
      <Stack spacing={1} direction='column'>
        <Text variant='h6'>Centered Tabs</Text>
        <CenteredTabs />
      </Stack>
      <Stack spacing={1} direction='column'>
        <Text variant='h6'>Scrollable Tabs</Text>
        <ScrollableTabsButtonAuto />
      </Stack>
      <Stack spacing={1} direction='column'>
        <Text variant='h6'>Forced Scroll Buttons</Text>
        <ScrollableTabsButtonForce />
      </Stack>
      <Stack spacing={1} direction='column'>
        <Text variant='h6'>Prevent Scroll Buttons</Text>
        <ScrollableTabsButtonPrevent />
      </Stack>
      <Stack spacing={1} direction='column'>
        <Text variant='h6'>Nav Tabs</Text>
        <NavTabs />
      </Stack>
      <Stack spacing={3} direction='row'>
        <Stack spacing={1} direction='column'>
          <Text variant='h6'>Icon Tabs</Text>
          <IconTabs />
        </Stack>
        <Stack spacing={1} direction='column'>
          <Text variant='h6'>Icon Label Tabs</Text>
          <IconLabelTabs />
        </Stack>
        <Stack spacing={1} direction='column'>
          <Text variant='h6'>Icon Position</Text>
          <IconPositionTabs />
        </Stack>
      </Stack>
      <Stack spacing={3} direction='row'>
        <Stack spacing={1} direction='column'>
          <Text variant='h6'>Selection Follows Focus</Text>
          <AccessibleTabs1 />
        </Stack>
        <Stack spacing={1} direction='column'>
          <Text variant='h6'>Needs To Be Selected</Text>
          <AccessibleTabs2 />
        </Stack>
      </Stack>
      <Stack spacing={1} direction='column'>
        <Text variant='h6'>Vertical Tabs</Text>
        <VerticalTabs />
      </Stack>
    </Stack>
  );
}
