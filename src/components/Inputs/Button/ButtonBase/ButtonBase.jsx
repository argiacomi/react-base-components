import React from 'react';
import clsx from 'clsx';
import styled, { extractStyling } from '@styles';
import { useForkRef, useSlotProps } from '@components/lib';
import useButton from './useButton';
// import useTouchRipple from './useTouchRipple';
import TouchRipple from './TouchRipple';

const buttonBaseClasses = {
  root: 'ButtonBase-Root',
  active: 'Active',
  disabled: 'Disabled',
  focusVisible: 'FocusVisible'
};

const ButtonBaseRoot = styled('button')(({ ownerState }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  boxSizing: 'border-box',
  WebkitTapHighlightColor: 'transparent',
  backgroundColor: 'transparent',
  outline: 0,
  border: 0,
  margin: 0,
  borderRadius: 0,
  padding: 0,
  cursor: 'pointer',
  userSelect: 'none',
  verticalAlign: 'middle',
  MozAppearance: 'none',
  WebkitAppearance: 'none',
  textDecoration: 'none',
  color: 'inherit',
  '&::-moz-focus-inner': {
    borderStyle: 'none'
  },
  ...(ownerState.disabled && {
    pointerEvents: 'none',
    cursor: 'default'
  }),
  '@media print': {
    colorAdjust: 'exact'
  },
  ...ownerState.cssStyles
}));

const ButtonBase = React.forwardRef((props, ref) => {
  const {
    action,
    centerRipple = false,
    children,
    color = 'primary',
    component = 'button',
    disabled = false,
    disableFocusRipple = false,
    disableRipple = false,
    disableTouchRipple = false,
    focusableWhenDisabled = false,
    focusVisibleClassName,
    slots = {},
    slotProps = {},
    tabIndex = 0,
    type,
    ...otherProps
  } = props;

  const { cssStyles, other } = extractStyling(otherProps);

  const buttonRef = React.useRef(null);
  const handleRef = useForkRef(buttonRef, ref);

  let ComponentProp = component;

  if (ComponentProp === 'button' && (other.href || other.to)) {
    ComponentProp = slots.link || 'a';
  }

  const { enableTouchRipple, getRootProps, focusVisible, setFocusVisible, active, rippleRef } =
    useButton({
      ...props,
      cssStyles,
      disabled,
      disableFocusRipple,
      disableRipple,
      disableTouchRipple,
      focusableWhenDisabled,
      rootRef: handleRef,
      tabIndex,
      type
    });

  React.useImperativeHandle(
    action,
    () => ({
      focusVisible: () => {
        setFocusVisible(true);
        buttonRef.current?.focus();
      }
    }),
    [setFocusVisible]
  );

  if (!import.meta.env.PROD) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    React.useEffect(() => {
      if (enableTouchRipple && !rippleRef.current) {
        console.error(
          [
            'The `component` prop provided to Button is invalid.',
            'Please make sure the children prop is rendered in this custom component.'
          ].join('\n')
        );
      }
    }, [enableTouchRipple, rippleRef]);
  }

  const ownerState = {
    ...props,
    active,
    color,
    component,
    disabled,
    focusVisible,
    tabIndex,
    type
  };

  const classes = {
    root: [
      buttonBaseClasses.root,
      ownerState.disabled && buttonBaseClasses.disabled,
      ownerState.focusVisible && clsx(buttonBaseClasses.focusVisible, focusVisibleClassName),
      ownerState.active && buttonBaseClasses.active
    ]
  };

  const Root = slots.root ?? ButtonBaseRoot;
  const rootProps = useSlotProps({
    elementType: Root,
    getSlotProps: getRootProps,
    externalForwardedProps: other,
    externalSlotProps: slotProps.root,
    additionalProps: {
      ref: ref
    },
    ownerState,
    className: classes.root
  });

  return (
    <Root as={ComponentProp} {...rootProps}>
      {children}
      {enableTouchRipple ? (
        /* TouchRipple is only needed client-side, x2 boost on the server. */
        <TouchRipple center={centerRipple} {...slotProps.touchRipple} ref={rippleRef} />
      ) : null}
    </Root>
  );
});

ButtonBase.displayName = 'ButtonBase';

export default ButtonBase;
