import React from 'react';
import styled from '@styles';
import {
  FormControlLabel,
  FormControl,
  FormGroup,
  FormLabel,
  FormHelperText,
  Stack,
  Switch,
  switchClasses,
  Text
} from '@components';

let label = { inputProps: { 'aria-label': 'Switch demo' } };

function BasicSwitches() {
  return (
    <div>
      <Switch {...label} defaultChecked />
      <Switch {...label} />
      <Switch {...label} disabled defaultChecked />
      <Switch {...label} disabled />
    </div>
  );
}

function SwitchLabels() {
  return (
    <FormGroup>
      <FormControlLabel control={<Switch defaultChecked />} label='Label' />
      <FormControlLabel required control={<Switch />} label='Required' />
      <FormControlLabel disabled control={<Switch />} label='Disabled' />
    </FormGroup>
  );
}

label = { inputProps: { 'aria-label': 'Size switch demo' } };

function SwitchesSize() {
  return (
    <FormControl component='fieldset'>
      <FormGroup aria-label='position' row>
        <FormControlLabel
          value='top'
          control={<Switch {...label} defaultChecked small />}
          label='Small'
          labelPlacement='top'
        />
        <FormControlLabel
          value='top'
          control={<Switch {...label} defaultChecked />}
          label='Medium'
          labelPlacement='top'
        />
      </FormGroup>
    </FormControl>
  );
}

label = { inputProps: { 'aria-label': 'Color switch demo' } };

function ColorSwitches() {
  return (
    <div>
      <Switch {...label} defaultChecked />
      <Switch {...label} defaultChecked color='primary' />
      <Switch {...label} defaultChecked color='secondary' />
      <Switch {...label} defaultChecked color='warning' />
      <Switch {...label} defaultChecked color='danger' />
    </div>
  );
}

function ControlledSwitches() {
  const [checked, setChecked] = React.useState(true);

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  return (
    <Switch checked={checked} onChange={handleChange} inputProps={{ 'aria-label': 'controlled' }} />
  );
}

function SwitchesGroup() {
  const [state, setState] = React.useState({
    gilad: true,
    jason: false,
    antoine: true
  });

  const handleChange = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.checked
    });
  };

  return (
    <FormControl component='fieldset' variant='standard'>
      <FormLabel component='legend'>Assign responsibility</FormLabel>
      <FormGroup>
        <FormControlLabel
          control={<Switch checked={state.gilad} onChange={handleChange} name='gilad' />}
          label='Gilad Gray'
        />
        <FormControlLabel
          control={<Switch checked={state.jason} onChange={handleChange} name='jason' />}
          label='Jason Killian'
        />
        <FormControlLabel
          control={<Switch checked={state.antoine} onChange={handleChange} name='antoine' />}
          label='Antoine Llorca'
        />
      </FormGroup>
      <FormHelperText>Be careful</FormHelperText>
    </FormControl>
  );
}

function FormControlLabelPosition() {
  return (
    <FormControl component='fieldset'>
      <FormGroup aria-label='position' row>
        <FormControlLabel
          value='top'
          control={<Switch color='primary' />}
          label='Top'
          labelPlacement='top'
        />
        <FormControlLabel
          value='start'
          control={<Switch color='primary' />}
          label='Start'
          labelPlacement='start'
        />
        <FormControlLabel
          value='bottom'
          control={<Switch color='primary' />}
          label='Bottom'
          labelPlacement='bottom'
        />
        <FormControlLabel
          value='end'
          control={<Switch color='primary' />}
          label='End'
          labelPlacement='end'
        />
      </FormGroup>
    </FormControl>
  );
}

const MaterialUISwitch = styled(Switch)(({ theme }) => ({
  width: 62,
  height: 34,
  padding: 7,
  [`& .${switchClasses.switchBase}`]: {
    margin: 1,
    padding: 0,
    transform: 'translateX(6px)',
    [`&.${switchClasses.checked}`]: {
      color: '#fff',
      transform: 'translateX(22px)',
      [`& .${switchClasses.thumb}:before`]: {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          '#fff'
        )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`
      },
      [`& + .${switchClasses.track}`]: {
        opacity: 1,
        backgroundColor: theme.color.mode === 'dark' ? '#8796A5' : '#aab4be'
      }
    }
  },
  [`& .${switchClasses.thumb}`]: {
    backgroundColor: theme.color.mode === 'dark' ? '#003892' : '#001e3c',
    width: 32,
    height: 32,
    '&:before': {
      content: "''",
      position: 'absolute',
      width: '100%',
      height: '100%',
      left: 0,
      top: 0,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
        '#fff'
      )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`
    }
  },
  [`& .${switchClasses.track}`]: {
    opacity: 1,
    backgroundColor: theme.color.mode === 'dark' ? '#8796A5' : '#aab4be',
    borderRadius: 20 / 2
  }
}));

const Android12Switch = styled(Switch)(({ theme }) => ({
  display: 'inline-flex',
  width: 34 + 12 * 2,
  height: 14 + 12 * 2,
  overflow: 'hidden',
  padding: 8,
  margin: 0,
  boxSizing: 'border-box',
  position: 'relative',
  flexShrink: 0,
  zIndex: 0,
  verticalAlign: 'middle',
  '@media print': {
    colorAdjust: 'exact'
  },
  ['.Switch-SwitchBase']: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1,
    color: theme.color.mode === 'light' ? theme.color.white : theme.color.gray[300],
    padding: 9,
    margin: 0,
    '&:hover': {
      backgroundColor: theme.alpha.add(theme.color.white, 0.08),
      '@media (hover: none)': {
        backgroundColor: 'transparent'
      }
    },
    transition: theme.transition.create(['left', 'transform'], {
      duration: theme.transition.duration.shortest
    }),
    [`&.${switchClasses.checked}`]: {
      transform: 'translateX(20px)'
    },
    [`&.${switchClasses.checked} + .${switchClasses.track}`]: {
      opacity: 0.5,
      backgroundColor: theme.color.primary.body
    },
    [`& .${switchClasses.input}`]: {
      left: '-100%',
      width: '300%'
    }
  },
  ['.Switch-Track']: {
    height: '100%',
    width: '100%',
    borderRadius: 22 / 2,
    zIndex: -1,
    transition: theme.transition.create(['opacity', 'background-color'], {
      duration: theme.transition.duration.shortest
    }),
    backgroundColor: theme.color.mode === 'light' ? theme.color.black : theme.color.white,
    opacity: theme.color.mode === 'light' ? 0.38 : 0.3
  },
  ['.Switch-Thumb']: {
    boxShadow: theme.boxShadow[1],
    backgroundColor: 'currentColor',
    filter: 'none',
    width: 16,
    height: 16,
    borderRadius: '50%',
    margin: 2
  },
  '& .Switch-Track': {
    borderRadius: 22 / 2,
    '&:before, &:after': {
      content: '""',
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      width: 16,
      height: 16
    },
    '&:before': {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.alpha.contrastText(theme.color.primary.body)
      )}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
      left: 12
    },
    '&:after': {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.alpha.contrastText(theme.color.primary.body)
      )}" d="M19,13H5V11H19V13Z" /></svg>')`,
      right: 12
    }
  },
  '& .Switch-Thumb': {
    boxShadow: 'none',
    width: 16,
    height: 16,
    margin: 2
  }
}));

const IOSSwitch = styled((props) => (
  <Switch focusVisibleClassName='.FocusVisible' disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  '& .Switch-SwitchBase': {
    padding: 0,
    margin: 2,
    transitionDuration: '300ms',
    '&.Checked': {
      transform: 'translateX(16px)',
      color: '#fff',
      '& + .Switch-Track': {
        backgroundColor: theme.color.mode === 'dark' ? '#2ECA45' : '#65C466',
        opacity: 1,
        border: 0
      },
      '&.Disabled + .Switch-Track': {
        opacity: 0.5
      }
    },
    '&.FocusVisible .Switch-Thumb': {
      color: '#33cf4d',
      border: '6px solid #fff'
    },
    '&.Disabled .Switch-Thumb': {
      color: theme.color.mode === 'light' ? theme.color.gray[100] : theme.color.gray[600]
    },
    '&.Disabled + .Switch-Track': {
      opacity: theme.color.mode === 'light' ? 0.7 : 0.3
    }
  },
  '& .Switch-Thumb': {
    boxSizing: 'border-box',
    width: 22,
    height: 22
  },
  '& .Switch-Track': {
    borderRadius: 26 / 2,
    backgroundColor: theme.color.mode === 'light' ? '#E9E9EA' : '#39393D',
    opacity: 1,
    transition: theme.transition.create(['background-color'], {
      duration: 500
    })
  }
}));

const AntSwitch = styled(Switch)(({ theme }) => ({
  width: 28,
  height: 16,
  padding: 0,
  display: 'flex',
  '&:active': {
    '& .Switch-Thumb': {
      width: 15
    },
    '& .Switch-SwitchBase.Checked': {
      transform: 'translateX(9px)'
    }
  },
  '& .Switch-SwitchBase': {
    '&.Checked': {
      transform: 'translateX(12px)',
      color: '#fff',
      '& + .Switch-Track': {
        opacity: 1,
        backgroundColor: theme.color.mode === 'dark' ? '#177ddc' : '#1890ff'
      }
    }
  },
  '& .Switch-Thumb': {
    boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
    width: 12,
    height: 12,
    borderRadius: 6,
    transition: theme.transition.create(['width'], {
      duration: 200
    })
  },
  '& .Switch-Track': {
    borderRadius: 16 / 2,
    opacity: 1,
    backgroundColor: theme.color.mode === 'dark' ? 'rgba(255,255,255,.35)' : 'rgba(0,0,0,.25)',
    boxSizing: 'border-box'
  }
}));

function CustomizedSwitches() {
  return (
    <FormGroup>
      <FormControlLabel
        control={<MaterialUISwitch sx={{ m: 1 }} defaultChecked />}
        label='MUI switch'
      />
      <FormControlLabel control={<Android12Switch defaultChecked />} label='Android 12' />
      <FormControlLabel control={<IOSSwitch sx={{ m: 1 }} defaultChecked />} label='iOS style' />
      <Stack direction='row' spacing={1} alignItems='center'>
        <Text>Off</Text>
        <AntSwitch defaultChecked inputProps={{ 'aria-label': 'ant design' }} />
        <Text>On</Text>
      </Stack>
    </FormGroup>
  );
}

export default function SwitchDemo() {
  return (
    <Stack spacing={5} direction='column'>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Basic Switches</Text>
        <BasicSwitches />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Labeled Switches</Text>
        <SwitchLabels />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Switch Sizes</Text>
        <SwitchesSize />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Switch Colors</Text>
        <ColorSwitches />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Controlled Switch</Text>
        <ControlledSwitches />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Switches with FormGroup</Text>
        <SwitchesGroup />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Switch Label Placement</Text>
        <FormControlLabelPosition />
      </Stack>
      <Stack display='inline-block' width='fit-content' spacing={1} direction='column'>
        <Text variant='h6'>Customized Switches</Text>
        <CustomizedSwitches />
      </Stack>
    </Stack>
  );
}
