import React from 'react';
import { extractEventHandlers, useEnhancedEffect, useForkRef } from '@components/lib';
import { useFormControl } from '@components/Inputs/Form';

function hasValue(value) {
  return value != null && !(Array.isArray(value) && value.length === 0);
}

function isFilled(obj, SSR = false) {
  return (
    obj &&
    ((hasValue(obj.value) && obj.value !== '') ||
      (SSR && hasValue(obj.defaultValue) && obj.defaultValue !== ''))
  );
}

export default function useInputBase(parameters) {
  const {
    disabled,
    inputProps: inputPropsProp = {},
    inputRef: inputRefProp,
    onBlur,
    onChange,
    onFocus,
    value: valueProp
  } = parameters;

  const value = inputPropsProp.value != null ? inputPropsProp.value : valueProp;
  const { current: isControlled } = React.useRef(value != null);

  const inputRef = React.useRef();
  const handleInputRefWarning = React.useCallback((instance) => {
    if (!import.meta.env.PROD) {
      if (instance && instance.nodeName !== 'INPUT' && !instance.focus) {
        console.error(
          `You have provided a 'inputComponent' to the input component that does not correctly handle the 'ref' prop.
          Make sure the 'ref' prop is called with a HTMLInputElement.`
        );
      }
    }
  }, []);

  const handleInputRef = useForkRef(
    inputRef,
    inputRefProp,
    inputPropsProp.ref,
    handleInputRefWarning
  );

  const [focused, setFocused] = React.useState(false);
  const formControl = useFormControl();

  if (!import.meta.env.PROD) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    React.useEffect(() => {
      if (formControl) {
        return formControl.registerEffect();
      }

      return undefined;
    }, [formControl]);
  }

  // The blur won't fire when the disabled state is set on a focused input.
  // We need to book keep the focused state manually.
  React.useEffect(() => {
    if (!formControl && disabled && focused) {
      setFocused(false);
      if (onBlur) {
        onBlur();
      }
    }
  }, [formControl, disabled, focused, onBlur]);

  const onFilled = formControl && formControl.onFilled;
  const onEmpty = formControl && formControl.onEmpty;

  const checkDirty = React.useCallback(
    (obj) => {
      if (isFilled(obj)) {
        if (onFilled) {
          onFilled();
        }
      } else if (onEmpty) {
        onEmpty();
      }
    },
    [onFilled, onEmpty]
  );

  useEnhancedEffect(() => {
    if (isControlled) {
      checkDirty({ value });
    }
  }, [value, checkDirty, isControlled]);

  const handleFocus = (otherHandlers) => (event) => {
    if (formControl.disabled) {
      event.stopPropagation();
      return;
    }

    if (otherHandlers.onFocus) {
      otherHandlers.onFocus(event);
    }
    if (inputPropsProp.onFocus) {
      inputPropsProp.onFocus(event);
    }

    if (formControl && formControl.onFocus) {
      formControl.onFocus(event);
    } else {
      setFocused(true);
    }
  };

  const handleBlur = (otherHandlers) => (event) => {
    if (otherHandlers.onBlur) {
      otherHandlers.onBlur(event);
    }
    if (inputPropsProp.onBlur) {
      inputPropsProp.onBlur(event);
    }

    if (formControl && formControl.onBlur) {
      formControl.onBlur(event);
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
            `Expected valid input target. Did you use a custom 'inputComponent' and forget to forward refs?`
          );
        }

        checkDirty({
          value: element.value
        });
      }

      if (inputPropsProp.onChange) {
        inputPropsProp.onChange(event, ...args);
      }

      if (formControl && formControl.onBlur) {
        formControl.onChange(event);
      }

      if (otherHandlers.onChange) {
        otherHandlers.onChange(event, ...args);
      }
    };

  React.useEffect(() => {
    checkDirty(inputRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClick = (otherHandlers) => (event) => {
    if (inputRef.current && event.currentTarget === event.target) {
      inputRef.current.focus();
    }
    if (otherHandlers.onClick && !formControl.disabled) {
      otherHandlers.onClick(event);
    }
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
      onFocus: handleFocus(externalEventHandlers)
    };

    return {
      ...mergedEventHandlers
    };
  };

  return {
    checkDirty,
    focused,
    formControl,
    getInputProps,
    getRootProps,
    handleInputRef,
    inputRef,
    value
  };
}
