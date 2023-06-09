import * as React from 'react';
import { useForkRef, useIsFocusVisible } from '@components/lib';
import { extractEventHandlers } from '@components/lib';

function useButton(parameters = {}) {
  const {
    disabled = false,
    focusableWhenDisabled,
    href,
    rootRef: externalRef,
    tabIndex,
    to,
    type
  } = parameters;

  // Ref to the button element
  const buttonRef = React.useRef();

  // State to track if button is active
  const [active, setActive] = React.useState(false);

  // Using the useIsFocusVisible hook
  const {
    isFocusVisibleRef,
    onFocus: handleFocusVisible,
    onBlur: handleBlurVisible,
    ref: focusVisibleRef
  } = useIsFocusVisible();

  // State to track if focus is visible
  const [focusVisible, setFocusVisible] = React.useState(false);

  // If the button is disabled and not focusable when disabled, and focus is visible, set focusVisible to false
  if (disabled && !focusableWhenDisabled && focusVisible) {
    setFocusVisible(false);
  }

  // Update isFocusVisibleRef.current whenever focusVisible changes
  React.useEffect(() => {
    isFocusVisibleRef.current = focusVisible;
  }, [focusVisible, isFocusVisibleRef]);

  // State to store the name of the host element
  const [hostElementName, setHostElementName] = React.useState('');

  const handleMouseLeave = (otherHandlers) => (event) => {
    if (focusVisible) {
      event.preventDefault();
    }
    otherHandlers.onMouseLeave?.(event);
  };

  const handleBlur = (otherHandlers) => (event) => {
    handleBlurVisible(event);
    if (isFocusVisibleRef.current === false) {
      setFocusVisible(false);
    }
    otherHandlers.onBlur?.(event);
  };

  const handleFocus = (otherHandlers) => (event) => {
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

  // Function to check if the button is a native button
  const isNativeButton = () => {
    const button = buttonRef.current;
    return (
      hostElementName === 'BUTTON' ||
      (hostElementName === 'INPUT' && ['button', 'submit', 'reset'].includes(button?.type)) ||
      (hostElementName === 'A' && button?.href)
    );
  };

  const handleClick = (otherHandlers) => (event) => {
    if (!disabled) {
      otherHandlers.onClick?.(event);
    }
  };

  const handleMouseDown = (otherHandlers) => (event) => {
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

  const handleKeyDown = (otherHandlers) => (event) => {
    otherHandlers.onKeyDown?.(event);
    if (event.defaultShoudldBePrevented) {
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

  const handleKeyUp = (otherHandlers) => (event) => {
    if (event.target === event.currentTarget) {
      setActive(false);
    }
    otherHandlers.onKeyUp?.(event);

    // Keyboard accessibility for non interactive elements
    if (
      event.target === event.currentTarget &&
      !isNativeButton() &&
      !disabled &&
      event.key === ' ' &&
      !event.defaultShouldBePrevented
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

  const getRootProps = (otherHandlers) => {
    const propsEventHandlers = extractEventHandlers(parameters);
    const externalEventHandlers = {
      ...propsEventHandlers,
      ...otherHandlers
    };

    delete externalEventHandlers.onFocusVisible;

    return {
      type,
      ...externalEventHandlers,
      ...buttonProps,
      onBlur: handleBlur(externalEventHandlers),
      onClick: handleClick(externalEventHandlers),
      onFocus: handleFocus(externalEventHandlers),
      onKeyDown: handleKeyDown(externalEventHandlers),
      onKeyUp: handleKeyUp(externalEventHandlers),
      onMouseDown: handleMouseDown(externalEventHandlers),
      onMouseLeave: handleMouseLeave(externalEventHandlers),
      ref: handleRef
    };
  };

  return {
    getRootProps,
    focusVisible,
    setFocusVisible,
    active,
    rootRef: handleRef
  };
}

export default useButton;
