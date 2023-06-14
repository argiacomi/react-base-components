import React from 'react';
import { styled } from '@styles';
import clsx from 'clsx';
import SwitchBase from './SwitchBase';

const switchClasses = {
  root: 'Switch-Root',
  switchBase: 'Switch-SwitchBase',
  input: 'Switch-Input',
  thumb: 'Switch-Thumb',
  track: 'Switch-Track',
  checked: 'Switch-Checked',
  disabled: 'Switch-Disabled'
};

const SwitchRoot = styled('span')(({ ownerState }) => ({
  display: 'inline-flex',
  width: '2.375rem',
  height: '1.25rem',
  margin: '0.5rem',
  padding: 0,
  overflow: 'hidden',
  boxSizing: 'border-box',
  position: 'relative',
  flexShrink: 0,
  zIndex: 0,
  verticalAlign: 'middle',
  ...(ownerState.edge &&
    (ownerState.edge === 'start' ? { marginLeft: '-0.5rem' } : { marginRight: '-0.5rem' })),
  ...(ownerState.small && {
    width: '2.125rem',
    height: '1.125rem',
    [`& .${ownerState.switchClasses.thumb}`]: {
      width: '.875rem',
      height: '.875rem'
    }
  })
}));

const SwitchSwitchBase = styled(SwitchBase)(({ theme, ownerState }) => ({
  position: 'absolute',
  padding: 0,
  margin: '.125rem',
  top: 0,
  left: 0,
  zIndex: 1,
  color: theme.color.mode === 'dark' ? theme.color.monochrome[500] : theme.color.white, //may need to change this
  transition: theme.transition.create(['left', 'transform'], {
    duration: theme.transition.duration.standard,
    delay: '0ms'
  }),
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    '@media (hover: none)': {
      backgroundColor: 'transparent'
    }
  },
  [`&.${ownerState.switchClasses.checked}`]: {
    transform: 'translate(calc(100% + .125rem))'
  },
  [`&.${ownerState.switchClasses.disabled}`]: {
    backgroundColor: theme.color.disabled
  },
  [`&.${ownerState.switchClasses.disabled} + .${ownerState.switchClasses.track}`]: {
    opacity: theme.color.mode === 'dark' ? 0.5 : 0.3
  },
  [`&.${ownerState.switchClasses.checked} + .${ownerState.switchClasses.track}`]: {
    ...(ownerState.color === 'success' || ownerState.color === 'warning'
      ? { backgroundColor: theme.alpha.add(theme.color[ownerState.color][500], 0.9) }
      : { backgroundColor: theme.color[ownerState.color][500] })
  },
  [`& .${ownerState.switchClasses.input}`]: {
    left: '-50%',
    width: '250%'
  }
}));

const SwitchTrack = styled('span')(({ theme }) => ({
  height: '100%',
  width: '100%',
  borderRadius: theme.rounded.full,
  zIndex: -1,
  transition: theme.transition.create(['opacity', 'background-color'], {
    duration: theme.transition.duration.standard,
    delay: '0ms'
  }),
  backgroundColor:
    theme.color.mode === 'dark'
      ? theme.alpha.add(theme.color.white, 0.55)
      : theme.alpha.add(theme.color.black, 0.25)
}));

const SwitchThumb = styled('span', {
  name: 'Switch',
  slot: 'Thumb'
})(({ theme }) => ({
  filter: theme.dropShadow['2xl'],
  backgroundColor: 'currentColor',
  width: theme.spacing(2),
  height: theme.spacing(2),
  borderRadius: theme.rounded.full
}));

const Switch = React.forwardRef((props, ref) => {
  const { className, color = 'success', edge = false, small = false, ...other } = props;

  const ownerState = {
    ...props,
    color,
    edge,
    small,
    switchClasses
  };

  const classes = {
    root: switchClasses.root,
    switchBase: [
      switchClasses.switchBase,
      ownerState.checked && switchClasses.checked,
      ownerState.disabled && switchClasses.disabled
    ],
    thumb: switchClasses.thumb,
    track: switchClasses.track,
    input: switchClasses.input
  };

  const icon = <SwitchThumb className={classes.thumb} ownerState={ownerState} />;

  return (
    <SwitchRoot className={clsx(classes.root, className)} ownerState={ownerState}>
      <SwitchSwitchBase
        type='checkbox'
        icon={icon}
        checkedIcon={icon}
        ref={ref}
        ownerState={ownerState}
        {...other}
        classes={classes.switchBase}
      />
      <SwitchTrack className={classes.track} ownerState={ownerState} />
    </SwitchRoot>
  );
});

Switch.displayName = 'Switch';

export default Switch;
