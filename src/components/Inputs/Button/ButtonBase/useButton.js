import * as React from 'react';
import { extractEventHandlers, useForkRef, useIsFocusVisible } from '@components/lib';
import useTouchRipple from './useTouchRipple';

export default function useButton(parameters) {
  const {
    disabled = false,
    disableFocusRipple = false,
    disableRipple = false,
    disableTouchRipple = false,
    focusableWhenDisabled,
    href,
    rootRef: externalRef,
    tabIndex,
    to,
    type
  } = parameters;

  const buttonRef = React.useRef();
  const rippleRef = React.useRef(null);

  const [active, setActive] = React.useState(false);

  const {
    isFocusVisibleRef,
    onFocus: handleFocusVisible,
    onBlur: handleBlurVisible,
    ref: focusVisibleRef
  } = useIsFocusVisible();

  const [focusVisible, setFocusVisible] = React.useState(false);
  if (disabled && !focusableWhenDisabled && focusVisible) {
    setFocusVisible(false);
  }

  React.useEffect(() => {
    isFocusVisibleRef.current = focusVisible;
  }, [focusVisible, isFocusVisibleRef]);

  const [hostElementName, setHostElementName] = React.useState('');

  const createHandleMouseLeave = (otherHandlers) => (event) => {
    if (focusVisible) {
      event.preventDefault();
    }

    otherHandlers.onMouseLeave?.(event);
  };

  const createHandleBlur = (otherHandlers) => (event) => {
    handleBlurVisible(event);

    if (isFocusVisibleRef.current === false) {
      setFocusVisible(false);
    }

    otherHandlers.onBlur?.(event);
  };

  const createHandleFocus = (otherHandlers) => (event) => {
    if (!buttonRef.current) {
      buttonRef.current = event.currentTarget;
    }

    handleFocusVisible(event);
    if (isFocusVisibleRef.current === true) {
      setFocusVisible(true);
      otherHandlers.onFocusVisible?.(event);
    }

    otherHandlers.onFocus?.(event);
  };

  const isNativeButton = () => {
    const button = buttonRef.current;

    return (
      hostElementName === 'BUTTON' ||
      (hostElementName === 'INPUT' && ['button', 'submit', 'reset'].includes(button?.type)) ||
      (hostElementName === 'A' && button?.href)
    );
  };

  const createHandleClick = (otherHandlers) => (event) => {
    if (!disabled) {
      otherHandlers.onClick?.(event);
    }
  };

  const createHandleMouseDown = (otherHandlers) => (event) => {
    if (!disabled) {
      setActive(true);
      document.addEventListener(
        'mouseup',
        () => {
          setActive(false);
        },
        { once: true }
      );
    }

    otherHandlers.onMouseDown?.(event);
  };

  const createHandleKeyDown = (otherHandlers) => (event) => {
    otherHandlers.onKeyDown?.(event);

    if (event.manualPrevented) {
      return;
    }

    if (event.target === event.currentTarget && !isNativeButton() && event.key === ' ') {
      event.preventDefault();
    }

    if (event.target === event.currentTarget && event.key === ' ' && !disabled) {
      setActive(true);
    }

    if (
      event.target === event.currentTarget &&
      !isNativeButton() &&
      event.key === 'Enter' &&
      !disabled
    ) {
      otherHandlers.onClick?.(event);
      event.preventDefault();
    }
  };

  const createHandleKeyUp = (otherHandlers) => (event) => {
    if (event.target === event.currentTarget) {
      setActive(false);
    }

    otherHandlers.onKeyUp?.(event);

    if (
      event.target === event.currentTarget &&
      !isNativeButton() &&
      !disabled &&
      event.key === ' ' &&
      !event.manualPrevented
    ) {
      otherHandlers.onClick?.(event);
    }
  };

  const updateHostElementName = React.useCallback((instance) => {
    setHostElementName(instance?.tagName ?? '');
  }, []);

  const handleRef = useForkRef(updateHostElementName, externalRef, focusVisibleRef, buttonRef);

  const buttonProps = {};

  if (hostElementName === 'BUTTON') {
    buttonProps.type = type ?? 'button';
    if (focusableWhenDisabled) {
      buttonProps['aria-disabled'] = disabled;
    } else {
      buttonProps.disabled = disabled;
    }
  } else if (hostElementName !== '') {
    if (!href && !to) {
      buttonProps.role = 'button';
      buttonProps.tabIndex = tabIndex ?? 0;
    }
    if (disabled) {
      buttonProps['aria-disabled'] = disabled;
      buttonProps.tabIndex = focusableWhenDisabled ? tabIndex ?? 0 : -1;
    }
  }

  const { enableTouchRipple, getRippleHandlers } = useTouchRipple({
    ...parameters,
    rippleRef
  });

  const getRootProps = (otherHandlers) => {
    const propsEventHandlers = extractEventHandlers(parameters);
    const externalEventHandlers = {
      ...propsEventHandlers,
      ...getRippleHandlers(otherHandlers),
      ...otherHandlers
    };

    delete externalEventHandlers.onFocusVisible;

    return {
      type,
      ...externalEventHandlers,
      ...buttonProps,
      onBlur: createHandleBlur(externalEventHandlers),
      onClick: createHandleClick(externalEventHandlers),
      onFocus: createHandleFocus(externalEventHandlers),
      onKeyDown: createHandleKeyDown(externalEventHandlers),
      onKeyUp: createHandleKeyUp(externalEventHandlers),
      onMouseDown: createHandleMouseDown(externalEventHandlers),
      onMouseLeave: createHandleMouseLeave(externalEventHandlers),
      ref: handleRef
    };
  };

  return {
    enableTouchRipple,
    getRootProps,
    focusVisible,
    setFocusVisible,
    active,
    rippleRef,
    rootRef: handleRef
  };
}
