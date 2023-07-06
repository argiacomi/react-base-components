import { Box, Fab, Icon, Stack, Text, Zoom } from '@components';
import React from 'react';
import { useTheme } from '@styles';

function FloatingActionButtons() {
  return (
    <Box css={{ '& > :not(style)': { margin: '.5rem' } }}>
      <Fab color='primary' aria-label='add'>
        <Icon icon='MdAdd' />
      </Fab>
      <Fab color='secondary' aria-label='edit'>
        <Icon icon='MdEdit' />
      </Fab>
      <Fab variant='extended'>
        <Icon icon='MdNavigation' css={{ marginRight: '.5rem' }} /> Navigate
      </Fab>
      <Fab disabled aria-label='like'>
        <Icon icon='MdFavorite' />
      </Fab>
    </Box>
  );
}

function FloatingActionButtonSize() {
  return (
    <Box css={{ '& > :not(style)': { margin: '.5rem' } }}>
      <Fab size='small' color='secondary' aria-label='add'>
        <Icon icon='MdAdd' />
      </Fab>
      <Fab size='medium' color='secondary' aria-label='add'>
        <Icon icon='MdAdd' />
      </Fab>
      <Fab color='secondary' aria-label='add'>
        <Icon icon='MdAdd' />
      </Fab>
    </Box>
  );
}

function FloatingActionButtonExtendedSize() {
  return (
    <Box css={{ '& > :not(style)': { margin: '.5rem' } }}>
      <Fab variant='extended' size='small' color='primary' aria-label='add'>
        <Icon icon='MdNavigation' css={{ marginRight: '.5rem' }} />
        Extended
      </Fab>
      <Fab variant='extended' size='medium' color='primary' aria-label='add'>
        <Icon icon='MdNavigation' css={{ marginRight: '.5rem' }} />
        Extended
      </Fab>
      <Fab variant='extended' color='primary' aria-label='add'>
        <Icon icon='MdNavigation' css={{ marginRight: '.5rem' }} />
        Extended
      </Fab>
    </Box>
  );
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Text
      component='div'
      role='tabpanel'
      hidden={value !== index}
      id={`action-tabpanel-${index}`}
      aria-labelledby={`action-tab-${index}`}
      {...other}
    >
      {value === index && <Box css={{ padding: '1.5rem' }}>{children}</Box>}
    </Text>
  );
}

function a11yProps(index) {
  return {
    id: `action-tab-${index}`,
    'aria-controls': `action-tabpanel-${index}`
  };
}

const fabStyle = {
  position: 'absolute',
  bottom: 16,
  right: 16
};

// function FloatingActionButtonZoom() {
//   const theme = useTheme();
//   const [value, setValue] = React.useState(0);

//   const handleChange = (event, newValue) => {
//     setValue(newValue);
//   };

//   const transitionDuration = {
//     enter: theme.transition.duration.enteringScreen,
//     exit: theme.transition.duration.leavingScreen
//   };

//   const fabs = [
//     {
//       color: 'primary',
//       css: fabStyle,
//       icon: <Icon icon='MdAdd' />,
//       label: 'Add'
//     },
//     {
//       color: 'secondary',
//       css: fabStyle,
//       icon: <Icon icon='MdEdit' />,
//       label: 'Edit'
//     },
//     {
//       color: 'success',
//       css: fabStyle,
//       icon: (
//         <Icon
//           icon='MdChevronLeft'
//           css={{
//             transform: 'rotate(90deg)'
//           }}
//         />
//       ),
//       label: 'Expand'
//     }
//   ];

//   return (
//     <Box
//       css={{
//         bgcolor: theme.color.background,
//         width: 500,
//         position: 'relative',
//         minHeight: 200
//       }}
//     >
//       <AppBar position='static' color='default'>
//         <Tabs
//           value={value}
//           onChange={handleChange}
//           indicatorColor='primary'
//           textColor='primary'
//           variant='fullWidth'
//           aria-label='action tabs example'
//         >
//           <Tab label='Item One' {...a11yProps(0)} />
//           <Tab label='Item Two' {...a11yProps(1)} />
//           <Tab label='Item Three' {...a11yProps(2)} />
//         </Tabs>
//       </AppBar>
//       <TabPanel value={value} index={0}>
//         Item One
//       </TabPanel>
//       <TabPanel value={value} index={1}>
//         Item Two
//       </TabPanel>
//       <TabPanel value={value} index={2}>
//         Item Three
//       </TabPanel>
//       {fabs.map((fab, index) => (
//         <Zoom
//           key={fab.color}
//           in={value === index}
//           timeout={transitionDuration}
//           style={{
//             transitionDelay: `${value === index ? transitionDuration.exit : 0}ms`
//           }}
//           unmountOnExit
//         >
//           <Fab css={fab.css} aria-label={fab.label} color={fab.color}>
//             {fab.icon}
//           </Fab>
//         </Zoom>
//       ))}
//     </Box>
//   );
// }

export default function FabDemo() {
  return (
    <Stack spacing={5} direction='column'>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Basic FAB</Text>
        <FloatingActionButtons />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>FAB Size</Text>
        <FloatingActionButtonSize />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>FAB Extended Size </Text>
        <FloatingActionButtonExtendedSize />
      </Stack>
      {/* <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>FAB Animation </Text>
        <FloatingActionButtonZoom />
      </Stack> */}
    </Stack>
  );
}
