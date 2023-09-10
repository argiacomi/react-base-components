import React from 'react';
import clsx from 'clsx';
import styled, { extractStyling } from '@styles';
import ButtonBase from '@components/inputs/button/buttonBase';

export const bottomNavigationActionClasses = {
  root: 'BottomNavigationAction-Root',
  label: 'BottomNavigationAction-Label',
  iconOnly: 'IconOnly',
  selected: 'Selected'
};

const BottomNavigationActionRoot = styled(ButtonBase, {
  name: 'BottomNavigationAction',
  slot: 'Root'
})(({ theme, ownerState }) => ({
  transition: theme.transition.create(['color', 'padding-top'], {
    duration: theme.transition.duration.short
  }),
  padding: '0px 12px',
  minWidth: 80,
  maxWidth: 168,
  color: theme.color.text.secondary,
  flexDirection: 'column',
  flex: '1',
  ...(!ownerState.showLabel &&
    !ownerState.selected && {
      paddingTop: 14
    }),
  ...(!ownerState.showLabel &&
    !ownerState.selected &&
    !ownerState.label && {
      paddingTop: 0
    }),
  [`&.${bottomNavigationActionClasses.selected}`]: {
    color: theme.color.primary.body
  },
  ...ownerState.cssStyles
}));

const BottomNavigationActionLabel = styled('span', {
  name: 'BottomNavigationAction',
  slot: 'Label'
})(({ theme, ownerState }) => ({
  fontFamily: 'inherit',
  fontSize: theme.pxToRem(12),
  opacity: 1,
  transition: 'font-size 0.2s, opacity 0.2s',
  transitionDelay: '0.1s',
  ...(!ownerState.showLabel &&
    !ownerState.selected && {
      opacity: 0,
      transitionDelay: '0s'
    }),
  [`&.${bottomNavigationActionClasses.selected}`]: {
    fontSize: theme.pxToRem(14)
  }
}));

const BottomNavigationAction = React.forwardRef((props, ref) => {
  const { className, icon, label, onChange, onClick, selected, showLabel, value, ...otherProps } =
    props;

  const { cssStyles, other } = extractStyling(otherProps);

  const ownerState = { ...props, cssStyles, selected, showLabel };
  const classes = {
    root: [
      bottomNavigationActionClasses.root,
      !ownerState.showLabel && !ownerState.selected && bottomNavigationActionClasses.iconOnly,
      ownerState.selected && bottomNavigationActionClasses.selected
    ],
    label: [
      bottomNavigationActionClasses.label,
      !ownerState.showLabel && !ownerState.selected && bottomNavigationActionClasses.iconOnly,
      ownerState.selected && bottomNavigationActionClasses.selected
    ]
  };

  const handleChange = (event) => {
    if (onChange) {
      onChange(event, value);
    }

    if (onClick) {
      onClick(event);
    }
  };

  return (
    <BottomNavigationActionRoot
      ref={ref}
      className={clsx(classes.root, className)}
      onClick={handleChange}
      ownerState={ownerState}
      {...other}
    >
      {icon}
      <BottomNavigationActionLabel className={clsx(classes.label)} ownerState={ownerState}>
        {label}
      </BottomNavigationActionLabel>
    </BottomNavigationActionRoot>
  );
});

BottomNavigationAction.displayName = 'BottomNavigationAction';

export default BottomNavigationAction;
