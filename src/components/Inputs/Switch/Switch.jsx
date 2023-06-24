// @inheritedComponent IconButton
import * as React from 'react';
import clsx from 'clsx';
import styled, { extractStyling } from '@styles';
import { useSlotProps } from '@components/lib';
import SwitchBase from './SwitchBase';

export const switchClasses = {
  root: 'Switch-Root',
  switchBase: 'Switch-SwitchBase',
  input: 'Switch-Input',
  thumb: 'Switch-Thumb',
  track: 'Switch-Track',
  checked: 'Checked',
  disabled: 'Disabled'
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
  '@media print': {
    colorAdjust: 'exact'
  },
  ...(ownerState.edge &&
    (ownerState.edge === 'start' ? { marginLeft: '-0.5rem' } : { marginRight: '-0.5rem' })),
  ...(ownerState.small && {
    width: '2.125rem',
    height: '1.125rem',
    [`& .${switchClasses.thumb}`]: {
      width: '.875rem',
      height: '.875rem'
    }
  }),
  ...ownerState.cssStyles
}));

const SwitchSwitchBase = styled(SwitchBase)(({ theme, ownerState }) => ({
  position: 'absolute',
  padding: 0,
  margin: '.125rem',
  top: 0,
  left: 0,
  zIndex: 1,
  color: theme.color.mode === 'dark' ? theme.color.monochrome[500] : theme.color.white,
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
  [`&.${switchClasses.checked}`]: {
    transform: 'translate(calc(100% + .125rem))'
  },
  [`&.${switchClasses.disabled}`]: {
    backgroundColor: theme.color.disabled
  },
  [`&.${switchClasses.disabled} + .${switchClasses.track}`]: {
    opacity: theme.color.mode === 'dark' ? 0.5 : 0.3
  },
  [`&.${switchClasses.checked} + .${switchClasses.track}`]: {
    ...(ownerState.color === 'success' || ownerState.color === 'warning'
      ? { backgroundColor: theme.alpha.add(theme.color[ownerState.color][500], 0.9) }
      : { backgroundColor: theme.color[ownerState.color][500] })
  },
  [`& .${switchClasses.input}`]: {
    left: '-125%',
    width: '325%'
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

const SwitchThumb = styled('span')(({ theme }) => ({
  filter: theme.dropShadow['2xl'],
  backgroundColor: 'currentColor',
  width: theme.spacing(2),
  height: theme.spacing(2),
  borderRadius: theme.rounded.full
}));

const Switch = React.forwardRef((props, ref) => {
  const {
    className,
    color = 'success',
    edge = false,
    slotProps = {},
    slots = {},
    small = false,
    ...otherProps
  } = props;

  const { cssStyles, other } = extractStyling(otherProps);

  const ownerState = {
    ...props,
    color,
    cssStyles,
    edge,
    small
  };

  const classes = {
    root: switchClasses.root,
    switchBase: [
      switchClasses.switchBase,
      ownerState.checked && switchClasses.checked,
      ownerState.disabled && switchClasses.disabled
    ],
    input: switchClasses.input,
    thumb: switchClasses.thumb,
    track: switchClasses.track
  };

  const Root = slots.root ?? SwitchRoot;
  const rootProps = useSlotProps({
    elementType: Root,
    externalSlotProps: slotProps.root,
    ownerState,
    className: clsx(classes.root, className)
  });

  const Thumb = slots.thumb ?? 'span';
  const thumbProps = useSlotProps({
    elementType: Thumb,
    externalSlotProps: slotProps.thumb,
    ownerState,
    className: classes.thumb
  });

  const icon = <SwitchThumb {...thumbProps} />;

  const Base = slots.root ?? SwitchSwitchBase;
  const baseProps = useSlotProps({
    elementType: Base,
    externalSlotProps: slotProps.base,
    externalForwardedProps: other,
    additionalProps: {
      checkedIcon: icon,
      icon: icon,
      ref: ref,
      slotProps: { input: { className: classes.input } },
      type: 'checkbox'
    },
    ownerState,
    className: classes.switchBase
  });

  const Track = slots.track === null ? () => null : slots.track ?? SwitchTrack;

  const trackProps = useSlotProps({
    elementType: Track,
    externalSlotProps: slotProps.track,
    ownerState,
    className: classes.track
  });

  return (
    <SwitchRoot {...rootProps}>
      <SwitchSwitchBase {...baseProps} />
      <SwitchTrack {...trackProps} />
    </SwitchRoot>
  );
});

Switch.displayName = 'Switch';

export default Switch;
