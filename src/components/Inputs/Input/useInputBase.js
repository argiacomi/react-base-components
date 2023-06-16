import React from 'react';
import { extractEventHandlers, useForkRef } from '@components/lib';
import { useFormControl } from '../Form/FormControl';

export default function useInput(parameters) {
  const {
    checkDirty,
    defaultValue: defaultValueProp,
    disabled: disabledProp = false,
    error: errorProp = false,
    inputProps: inputPropsProp = {},
    inputRef: inputRefProp,
    onBlur,
    onChange,
    onFocus,
    required: requiredProp = false,
    value: valueProp
  } = parameters;

  const formControl = useFormControl();

  let defaultValue;
  let disabled;
  let error;
  let required;
  let value;

  if (formControl) {
    defaultValue = undefined;
    disabled = formControl.disabled ?? false;
    error = formControl.error ?? false;
    required = formControl.required ?? false;
    value = formControl.value;

    if (!import.meta.env.PROD) {
      const definedLocalProps = ['defaultValue', 'disabled', 'error', 'required', 'value'].filter(
        (prop) => parameters[prop] !== undefined
      );

      if (definedLocalProps.length > 0) {
        console.warn(
          `You have set props on an input that is inside a FormControl.
          Set these props on a FormControl instead. Otherwise they will be ignored.
          Ignored props: ${definedLocalProps}`
        );
      }
    }
  } else {
    defaultValue = defaultValueProp;
    disabled = disabledProp;
    error = errorProp;
    required = requiredProp;
    value = inputPropsProp.value != null ? inputPropsProp.value : valueProp;
  }

  const { current: isControlled } = React.useRef(value != null);

  const handleInputRefWarning = React.useCallback((instance) => {
    if (!import.meta.env.PROD) {
      if (instance && instance.nodeName !== 'INPUT' && !instance.focus) {
        console.error(
          `You have provided an 'inputComponent' to the input component
          that does not correctly handle the 'ref' prop.
          Make sure the 'ref' prop is called with an HTMLInputElement.`
        );
      }
    }
  }, []);

  const inputRef = React.useRef();
  const handleInputRef = useForkRef(
    inputRef,
    inputRefProp,
    inputPropsProp.ref,
    handleInputRefWarning
  );

  const [focused, setFocused] = React.useState(false);

  React.useEffect(() => {
    if (!formControl && disabled && focused) {
      setFocused(false);

      onBlur?.();
    }
  }, [formControl, disabled, focused, onBlur]);

  const handleFocus = (otherHandlers) => (event) => {
    if (formControl?.disabled) {
      event.stopPropagation();
      return;
    }

    otherHandlers.onFocus?.(event);

    if (inputPropsProp.onFocus) {
      inputPropsProp.onFocus(event);
    }

    if (formControl && formControl.onFocus) {
      formControl?.onFocus?.();
    } else {
      setFocused(true);
    }
  };

  const handleBlur = (otherHandlers) => (event) => {
    otherHandlers.onBlur?.(event);

    if (formControl && formControl.onBlur) {
      formControl.onBlur();
    } else {
      setFocused(false);
    }
  };

  const handleChange =
    (otherHandlers) =>
    (event, ...args) => {
      if (!isControlled) {
        const element = event.target || inputRef.current;
        if (element == null) {
          console.error(
            `Expected valid input target.
            Did you use a custom 'inputComponent and forget to forward refs?`
          );
        }

        checkDirty({
          value: element.value
        });
      }
      formControl?.onChange?.(event);

      otherHandlers.onChange?.(event, ...args);
    };

  const handleClick = (otherHandlers) => (event) => {
    if (inputRef.current && event.currentTarget === event.target) {
      inputRef.current.focus();
    }

    if (otherHandlers.onClick && !disabled) {
      otherHandlers.onClick?.(event);
    }
  };

  const handleAutoFill = (event) => {
    checkDirty(event.animationName === 'auto-fill-cancel' ? inputRef.current : { value: 'x' });
  };

  const getRootProps = (externalProps) => {
    const propsEventHandlers = extractEventHandlers(parameters, ['onBlur', 'onChange', 'onFocus']);
    const externalEventHandlers = { ...propsEventHandlers, ...extractEventHandlers(externalProps) };

    return {
      ...externalProps,
      ...externalEventHandlers,
      onClick: handleClick(externalEventHandlers)
    };
  };

  const getInputProps = (externalProps) => {
    const propsEventHandlers = {
      onBlur,
      onChange,
      onFocus
    };

    const externalEventHandlers = { ...propsEventHandlers, ...extractEventHandlers(externalProps) };

    const mergedEventHandlers = {
      ...externalProps,
      ...externalEventHandlers,
      onBlur: handleBlur(externalEventHandlers),
      onChange: handleChange(externalEventHandlers),
      onFocus: handleFocus(externalEventHandlers),
      onAnimationStart: handleAutoFill(externalEventHandlers)
    };

    return {
      ...mergedEventHandlers,
      'aria-invalid': error || undefined,
      defaultValue: defaultValue,
      ref: handleInputRef,
      value: value,
      required,
      disabled
    };
  };

  return {
    disabled,
    error,
    focused,
    formControl,
    getInputProps,
    getRootProps,
    inputRef: handleInputRef,
    isControlled,
    required,
    value
  };
}
