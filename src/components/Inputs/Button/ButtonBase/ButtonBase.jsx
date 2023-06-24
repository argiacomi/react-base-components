import React from 'react';
import clsx from 'clsx';
import styled from '@styles';
import { useForkRef } from '@components/lib';
import useButton from './useButton';
import TouchRipple from './TouchRipple';
import useTouchRipple from './useTouchRipple';

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
  }
}));

const ButtonBase = React.forwardRef((props, ref) => {
  const {
    action,
    centerRipple = false,
    children,
    className,
    classes: classesProp,
    component = 'button',
    disabled = false,
    focusableWhenDisabled = false,
    focusVisibleClassName,
    disableRipple = false,
    disableTouchRipple = false,
    LinkComponent = 'a',
    onFocusVisible,
    tabIndex = 0,
    TouchRippleProps,
    type,
    ...other
  } = props;

  const buttonRef = React.useRef(null);
  const handleRef = useForkRef(buttonRef, ref);

  const rippleRef = React.useRef(null);
  let ComponentProp = component;

  if (ComponentProp === 'button' && (other.href || other.to)) {
    ComponentProp = LinkComponent;
  }

  const { focusVisible, active, setFocusVisible, getRootProps } = useButton({
    disabled,
    focusableWhenDisabled,
    href: props.href,
    onFocusVisible,
    tabIndex,
    to: props.to,
    type,
    rootRef: handleRef
  });

  React.useImperativeHandle(
    action,
    () => ({
      focusVisible: () => {
        setFocusVisible(true);
        buttonRef.current.focus();
      }
    }),
    [setFocusVisible]
  );

  const { enableTouchRipple, getRippleHandlers } = useTouchRipple({
    disabled,
    disableRipple,
    disableTouchRipple,
    rippleRef
  });

  if (!import.meta.env.PROD) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    React.useEffect(() => {
      if (enableTouchRipple && !rippleRef.current) {
        console.error(
          `The 'component prop provided to Button is invalid.
          Please make sure the children prop is rendered in this custom component.`
        );
      }
    }, [enableTouchRipple]);
  }

  const ownerState = {
    ...props,
    classes: classesProp,
    component,
    disabled,
    active,
    focusVisible,
    tabIndex,
    type
  };

  const classes = ['ButtonBase-Root', focusVisible && focusVisibleClassName];

  return (
    <ButtonBaseRoot
      as={ComponentProp}
      className={clsx(classes, className)}
      ownerState={ownerState}
      {...getRootProps(getRippleHandlers(other))}
      {...other}
    >
      {children}
      {enableTouchRipple ? (
        <TouchRipple center={centerRipple} {...TouchRippleProps} ref={rippleRef} />
      ) : null}
    </ButtonBaseRoot>
  );
});
ButtonBase.displayName = 'ButtonBase';

export default ButtonBase;
