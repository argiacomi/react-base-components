import React from 'react';
import { useControlled, useForkRef, useIsFocusVisible } from '@components/lib';
import { useFormControl } from '@components/inputs';

export default function useSwitch(props) {
  const {
    autoFocus,
    checked: checkedProp,
    defaultChecked,
    disabled: disabledProp,
    id,
    inputRef: externalInputRef,
    name,
    onBlur,
    onChange,
    onFocus,
    onFocusVisible,
    readOnly,
    required,
    tabIndex,
    type,
    value
  } = props;

  const [checked, setCheckedState] = useControlled({
    controlled: checkedProp,
    default: Boolean(defaultChecked),
    name: 'Switch',
    state: 'checked'
  });

  const formControl = useFormControl();

  let disabled = disabledProp;

  if (formControl) {
    if (typeof disabled === 'undefined') {
      disabled = formControl.disabled;
    }
  }

  const createHandleInputChange = (otherProps) => (event) => {
    if (event.nativeEvent.defaultPrevented) {
      return;
    }

    setCheckedState(event.target.checked);
    if (onChange) {
      onChange(event);
    }
    if (otherProps.onChange) {
      otherProps.onChange(event);
    }
  };

  const {
    isFocusVisibleRef,
    onBlur: handleBlurVisible,
    onFocus: handleFocusVisible,
    ref: focusVisibleRef
  } = useIsFocusVisible();

  const [focusVisible, setFocusVisible] = React.useState(false);
  if (disabled && focusVisible) {
    setFocusVisible(false);
  }

  React.useEffect(() => {
    isFocusVisibleRef.current = focusVisible;
  }, [focusVisible, isFocusVisibleRef]);

  const inputRef = React.useRef(null);

  const createHandleFocus = (otherProps) => (event) => {
    if (!inputRef.current) {
      inputRef.current = event.currentTarget;
    }

    handleFocusVisible(event);
    if (isFocusVisibleRef.current === true) {
      setFocusVisible(true);
      if (onFocusVisible) {
        onFocusVisible(event);
      }
    }

    if (onFocus) {
      onFocus(event);
    }
    if (formControl && formControl.onFocus) {
      formControl.onFocus(event);
    }
    if (otherProps.onFocus) {
      otherProps.onFocus(event);
    }
  };

  const createHandleBlur = (otherProps) => (event) => {
    handleBlurVisible(event);

    if (isFocusVisibleRef.current === false) {
      setFocusVisible(false);
    }

    if (onBlur) {
      onBlur(event);
    }
    if (formControl && formControl.onBlur) {
      formControl.onBlur(event);
    }
    if (otherProps.onBlur) {
      otherProps.onBlur(event);
    }
  };

  const handleInputRef = useForkRef(focusVisibleRef, inputRef, externalInputRef);

  const hasLabelFor = type === 'checkbox' || type === 'radio';

  const getInputProps = (otherProps = {}) => ({
    autoFocus,
    checked: checkedProp,
    defaultChecked,
    disabled,
    id: hasLabelFor ? id : undefined,
    name,
    readOnly,
    ref: handleInputRef,
    required,
    tabIndex,
    type,
    ...(type === 'checkbox' && value === undefined ? {} : { value }),
    ...otherProps,
    onChange: createHandleInputChange(otherProps),
    onFocus: createHandleFocus(otherProps),
    onBlur: createHandleBlur(otherProps)
  });

  return {
    checked,
    disabled: Boolean(disabled),
    focusVisible,
    getInputProps,
    inputRef: handleInputRef,
    readOnly: Boolean(readOnly)
  };
}
