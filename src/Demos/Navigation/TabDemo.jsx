import { Box, Icon, Stack, Tab, TabPanel, Tabs, TabsList, Text } from '@components';
import React from 'react';

function BasicTabs() {
  return (
    <Tabs maxWidth={725} defaultValue={0}>
      <TabsList borderBottom={1} borderColor='divider' aria-label='basic tabs example'>
        <Tab label='Item One' />
        <Tab label='Item Two' />
        <Tab label='Item Three' />
      </TabsList>
      <TabPanel>Item One</TabPanel>
      <TabPanel>Item Two</TabPanel>
      <TabPanel>Item Three</TabPanel>
    </Tabs>
  );
}

function ColorTabs() {
  const [value, setValue] = React.useState('one');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Tabs value={value} onChange={handleChange} maxWidth={725}>
      <TabsList
        borderBottom={1}
        borderColor='divider'
        textColor='secondary'
        indicatorColor='secondary'
        aria-label='secondary color tabs example'
      >
        <Tab value='one' label='Item One' />
        <Tab value='two' label='Item Two' />
        <Tab value='three' label='Item Three' />
      </TabsList>
    </Tabs>
  );
}

function DisabledTabs() {
  return (
    <Tabs maxWidth={725} defaultValue={0}>
      <TabsList aria-label='disabled tabs example'>
        <Tab label='Active' />
        <Tab label='Disabled' disabled />
        <Tab label='Active' />
      </TabsList>
    </Tabs>
  );
}

function CenteredTabs() {
  return (
    <Tabs maxWidth={725} defaultValue={0}>
      <TabsList backgroundColor='background' centered aria-label='centered tabs example'>
        <Tab label='Item One' />
        <Tab label='Item Two' />
        <Tab label='Item Three' />
      </TabsList>
    </Tabs>
  );
}

function ScrollableTabsButtonAuto() {
  return (
    <Tabs
      maxWidth={320}
      defaultValue={0}
      css={({ theme }) => ({
        [theme.breakpoints.up('sm')]: { maxWidth: 480 },
        backgroundColor: theme.color.gray[1000]
      })}
    >
      <TabsList variant='scrollable' scrollButtons='auto' aria-label='scrollable auto tabs example'>
        <Tab label='Item One' />
        <Tab label='Item Two' />
        <Tab label='Item Three' />
        <Tab label='Item Four' />
        <Tab label='Item Five' />
        <Tab label='Item Six' />
        <Tab label='Item Seven' />
      </TabsList>
    </Tabs>
  );
}

function ScrollableTabsButtonForce() {
  return (
    <Tabs
      maxWidth={320}
      defaultValue={0}
      css={({ theme }) => ({
        [theme.breakpoints.up('sm')]: { maxWidth: 445 },
        backgroundColor: theme.color.background
      })}
    >
      <TabsList
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
      </TabsList>
    </Tabs>
  );
}

function ScrollableTabsButtonPrevent() {
  return (
    <Tabs
      maxWidth={320}
      css={({ theme }) => ({
        [theme.breakpoints.up('sm')]: { maxWidth: 445 },
        backgroundColor: theme.color.background
      })}
      defaultValue={0}
    >
      <TabsList
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
      </TabsList>
    </Tabs>
  );
}

function NavTabs() {
  const [value, setValue] = React.useState('one');
  const [target, setTarget] = React.useState('/drafts');

  const LinkTab = (props) => (
    <Tab
      component='a'
      onClick={(event) => {
        setValue(event.target.attributes.value.value);
        setTarget(event.target.attributes.href.value);
        event.preventDefault();
      }}
      {...props}
    />
  );

  return (
    <Tabs value={value} maxWidth={320}>
      <TabsList aria-label='nav tabs example'>
        <LinkTab value='one' label='Page One' href='/drafts' />
        <LinkTab value='two' label='Page Two' href='/trash' />
        <LinkTab value='three' label='Page Three' href='/spam' />
      </TabsList>
      <TabPanel value='one'>{`${target}`}</TabPanel>
      <TabPanel value='two'>{`${target}`}</TabPanel>
      <TabPanel value='three'>{`${target}`}</TabPanel>
    </Tabs>
  );
}

function IconTabs() {
  return (
    <Tabs maxWidth={320}>
      <TabsList aria-label='icon tabs example'>
        <Tab icon={<Icon icon='MdPhone' />} aria-label='phone' />
        <Tab icon={<Icon icon='MdFavorite' />} aria-label='favorite' />
        <Tab icon={<Icon icon='MdPerson' />} aria-label='person' />
      </TabsList>
    </Tabs>
  );
}

function IconLabelTabs() {
  return (
    <Tabs maxWidth={320}>
      <TabsList aria-label='icon label tabs example'>
        <Tab icon={<Icon icon='MdPhone' />} label='RECENTS' aria-label='phone' />
        <Tab icon={<Icon icon='MdFavorite' />} label='FAVORITES' aria-label='favorite' />
        <Tab icon={<Icon icon='MdPerson' />} label='NEARBY' aria-label='person' />
      </TabsList>
    </Tabs>
  );
}

function IconPositionTabs() {
  return (
    <Tabs maxWidth={400}>
      <TabsList aria-label='icon position tabs example'>
        <Tab icon={<Icon icon='MdPhone' />} label='top' />
        <Tab icon={<Icon icon='MdPhone' />} iconPosition='start' label='start' />
        <Tab icon={<Icon icon='MdFavorite' />} iconPosition='end' label='end' />
        <Tab icon={<Icon icon='MdPerson' />} iconPosition='bottom' label='bottom' />
      </TabsList>
    </Tabs>
  );
}

function AccessibleTabs1() {
  return (
    <Tabs wdth='100%' selectionFollowsFocus>
      <TabsList aria-label='Tabs where selection follows focus'>
        <Tab label='Item One' />
        <Tab label='Item Two' />
        <Tab label='Item Three' />
      </TabsList>
    </Tabs>
  );
}

function AccessibleTabs2() {
  return (
    <Tabs wdth='100%'>
      <TabsList aria-label='Tabs where each tab needs to be selected manually'>
        <Tab label='Item One' />
        <Tab label='Item Two' />
        <Tab label='Item Three' />
      </TabsList>
    </Tabs>
  );
}

function VerticalTabs() {
  return (
    <Tabs
      orientation='vertical'
      flexGrow={1}
      backgroundColor='background'
      display='flex'
      height={300}
      defaultValue={0}
      maxWidth={1080}
    >
      <TabsList
        variant='scrollable'
        aria-label='Vertical tabs example'
        sx={{ borderRight: 1, borderColor: 'divider' }}
      >
        <Tab label='Item One' />
        <Tab label='Item Two' />
        <Tab label='Item Three' />
        <Tab label='Item Four' />
        <Tab label='Item Five' />
        <Tab label='Item Six' />
        <Tab label='Item Seven' />
      </TabsList>
      <TabPanel>Item One</TabPanel>
      <TabPanel>Item Two</TabPanel>
      <TabPanel>Item Three</TabPanel>
      <TabPanel>Item Four</TabPanel>
      <TabPanel>Item Five</TabPanel>
      <TabPanel>Item Six</TabPanel>
      <TabPanel>Item Seven</TabPanel>
    </Tabs>
  );
}

export default function TabDemo() {
  return (
    <Stack spacing={5} direction='column'>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Basic Tabs</Text>
        <BasicTabs />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Color Tabs</Text>
        <ColorTabs />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Disabled Tabs</Text>
        <DisabledTabs />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Centered Tabs</Text>
        <CenteredTabs />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Scrollable Tabs</Text>
        <ScrollableTabsButtonAuto />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Forced Scroll Buttons</Text>
        <ScrollableTabsButtonForce />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Prevent Scroll Buttons</Text>
        <ScrollableTabsButtonPrevent />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Nav Tabs</Text>
        <NavTabs />
      </Stack>
      <Stack spacing={3} direction='row'>
        <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
          <Text variant='h6'>Icon Tabs</Text>
          <IconTabs />
        </Stack>
        <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
          <Text variant='h6'>Icon Label Tabs</Text>
          <IconLabelTabs />
        </Stack>
        <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
          <Text variant='h6'>Icon Position</Text>
          <IconPositionTabs />
        </Stack>
      </Stack>
      <Stack spacing={3} direction='row'>
        <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
          <Text variant='h6'>Selection Follows Focus</Text>
          <AccessibleTabs1 />
        </Stack>
        <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
          <Text variant='h6'>Needs To Be Selected</Text>
          <AccessibleTabs2 />
        </Stack>
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Vertical Tabs</Text>
        <VerticalTabs />
      </Stack>
    </Stack>
  );
}
