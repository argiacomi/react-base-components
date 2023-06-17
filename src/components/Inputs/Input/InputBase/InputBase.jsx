import React from 'react';
import clsx from 'clsx';
import { styled, GlobalStyles } from '@styles';
import useInputBase from './useInputBase';
import TextareaAutosize from '../InputHelpers/TextareaAutosize';
import { FormControlContext, formControlState, useFormControl } from '@components/Inputs/Form';
import { useEnhancedEffect, useForkRef } from '@components/lib';

export const inputBaseClasses = {
  root: 'InputBase-Root',
  input: 'InputBase-Input',
  disabled: 'InputBase-Disabled',
  error: 'InputBase-Error',
  focused: 'InputBase-Focused',
  formControl: 'InputBase-FormControl'
};

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

export const InputBaseRoot = styled('div')(({ theme, ownerState }) => ({
  ...theme.text.typography.body1,
  color: theme.color.text.primary,
  lineHeight: theme.spacing(23 / 8), // 23px
  boxSizing: 'border-box',
  position: 'relative',
  cursor: 'text',
  display: 'inline-flex',
  alignItems: 'center',
  [`&.${inputBaseClasses.disabled}`]: {
    color: theme.color.text.disabled,
    cursor: 'default'
  },
  ...(ownerState.multiline && {
    padding: '4px 0 5px',
    ...(ownerState.size === 'small' && {
      paddingTop: 1
    })
  }),
  ...(ownerState.fullWidth && {
    width: '100%'
  })
}));

export const InputBaseComponent = styled('input')(({ theme, ownerState }) => {
  const light = theme.color.mode === 'light';
  const placeholder = {
    color: 'currentColor',
    opacity: light ? 0.42 : 0.5,
    transition: theme.transition.create('opacity', {
      duration: theme.transition.duration.shorter
    })
  };

  const placeholderHidden = {
    opacity: '0 !important'
  };

  const placeholderVisible = { opacity: light ? 0.42 : 0.5 };

  return {
    font: 'inherit',
    letterSpacing: 'inherit',
    color: 'currentColor',
    padding: '4px 0 5px',
    border: 0,
    boxSizing: 'content-box',
    background: 'none',
    height: '1.4375em', // Reset 23pxthe native input line-height
    margin: 0, // Reset for Safari
    WebkitTapHighlightColor: 'transparent',
    display: 'block',
    // Make the flex item shrink with Firefox
    minWidth: 0,
    width: '100%', // Fix IE11 width issue
    animationName: 'auto-fill-cancel',
    animationDuration: '10ms',
    '&::-webkit-input-placeholder': placeholder,
    '&::-moz-placeholder': placeholder, // Firefox 19+
    '&:-ms-input-placeholder': placeholder, // IE11
    '&::-ms-input-placeholder': placeholder, // Edge
    '&:focus': {
      outline: 0
    },
    // Reset Firefox invalid required input style
    '&:invalid': {
      boxShadow: 'none'
    },
    '&::-webkit-search-decoration': {
      // Remove the padding when type=search.
      WebkitAppearance: 'none'
    },
    // Show and hide the placeholder logic
    [`label[data-shrink=false] + .${inputBaseClasses.formControl} &`]: {
      '&::-webkit-input-placeholder': placeholderHidden,
      '&::-moz-placeholder': placeholderHidden, // Firefox 19+
      '&:-ms-input-placeholder': placeholderHidden, // IE11
      '&::-ms-input-placeholder': placeholderHidden, // Edge
      '&:focus::-webkit-input-placeholder': placeholderVisible,
      '&:focus::-moz-placeholder': placeholderVisible, // Firefox 19+
      '&:focus:-ms-input-placeholder': placeholderVisible, // IE11
      '&:focus::-ms-input-placeholder': placeholderVisible // Edge
    },
    [`&.${inputBaseClasses.disabled}`]: {
      opacity: 1,
      WebkitTextFillColor: theme.color.disabled.text
    },
    '&:-webkit-autofill': {
      animationDuration: '5000s',
      animationName: 'auto-fill'
    },
    ...(ownerState.size === 'small' && {
      paddingTop: 1
    }),
    ...(ownerState.multiline && {
      height: 'auto',
      resize: 'none',
      padding: 0,
      paddingTop: 0
    }),
    ...(ownerState.type === 'search' && {
      // Improve type search style.
      MozAppearance: 'textfield'
    })
  };
});

const inputGlobalStyles = (
  <GlobalStyles
    styles={{
      '@keyframes auto-fill': { from: { display: 'block' } },
      '@keyframes auto-fill-cancel': { from: { display: 'block' } }
    }}
  />
);

const InputBase = React.forwardRef((props, ref) => {
  const {
    'aria-describedby': ariaDescribedby,
    autoComplete,
    autoFocus,
    classes: classesProp = {},
    className,
    defaultValue,
    disabled,
    disableInjectingGlobalStyles,
    endAdornment,
    fullWidth = false,
    id,
    inputComponent = 'input',
    inputProps: inputPropsProp = {},
    inputRef: inputRefProp,
    maxRows,
    minRows,
    multiline = false,
    name,
    onBlur,
    onChange,
    onClick,
    onFocus,
    onKeyDown,
    onKeyUp,
    placeholder,
    readOnly,
    renderSuffix,
    rows,
    slotProps = {},
    slots = {},
    startAdornment,
    type = 'text',
    value: valueProp,
    ...other
  } = props;

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

  const fcs = formControlState({
    props,
    formControl,
    states: ['color', 'disabled', 'error', 'hiddenLabel', 'size', 'required', 'filled']
  });

  fcs.focused = formControl ? formControl.focused : focused;

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

  const handleFocus = (event) => {
    // Fix a bug with IE11 where the focus/blur events are triggered
    // while the component is disabled.
    if (fcs.disabled) {
      event.stopPropagation();
      return;
    }

    if (onFocus) {
      onFocus(event);
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

  const handleBlur = (event) => {
    if (onBlur) {
      onBlur(event);
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

  const handleChange = (event, ...args) => {
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

    // Perform in the willUpdate
    if (onChange) {
      onChange(event, ...args);
    }
  };

  // Check the input state on mount, in case it was filled by the user
  // or auto filled by the browser before the hydration (for SSR).
  React.useEffect(() => {
    checkDirty(inputRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClick = (event) => {
    if (inputRef.current && event.currentTarget === event.target) {
      inputRef.current.focus();
    }
    if (onClick && !fcs.disabled) {
      onClick(event);
    }
  };
  let InputComponent = inputComponent;
  let inputProps = inputPropsProp;

  if (multiline && InputComponent === 'input') {
    if (rows) {
      if (!import.meta.env.PROD) {
        if (minRows || maxRows) {
          console.warn(
            `You can not use the 'minRows' or 'maxRows' props when the input 'rows' prop is set.`
          );
        }
      }
      inputProps = {
        type: undefined,
        minRows: rows,
        maxRows: rows,
        ...inputProps
      };
    } else {
      inputProps = {
        type: undefined,
        maxRows,
        minRows,
        ...inputProps
      };
    }

    InputComponent = TextareaAutosize;
  }

  const handleAutoFill = (event) => {
    // Provide a fake value as Chrome might not let you access it for security reasons.
    checkDirty(event.animationName === 'auto-fill-cancel' ? inputRef.current : { value: 'x' });
  };

  React.useEffect(() => {
    if (formControl) {
      formControl.setAdornedStart(Boolean(startAdornment));
    }
  }, [formControl, startAdornment]);

  const ownerState = {
    ...props,
    color: fcs.color || 'primary',
    disabled: fcs.disabled,
    endAdornment,
    error: fcs.error,
    focused: fcs.focused,
    formControl: formControl,
    fullWidth,
    hiddenLabel: fcs.hiddenLabel,
    multiline,
    size: fcs.size,
    startAdornment,
    type
  };

  const classes = {
    ...classesProp,
    root: [
      inputBaseClasses.root,
      ownerState.disabled && inputBaseClasses.disabled,
      ownerState.error && inputBaseClasses.error,
      ownerState.focused && inputBaseClasses.focused,
      ownerState.formControl && inputBaseClasses.formControl,
      classesProp?.root
    ],
    input: ['InputBase-Input', classesProp?.input, ownerState.disabled && inputBaseClasses.disabled]
  };

  const Root = slots.root || InputBaseRoot;
  const rootProps = slotProps.root || {};

  const Input = slots.input || InputBaseComponent;
  inputProps = { ...inputProps, ...slotProps.input };

  return (
    <React.Fragment>
      {!disableInjectingGlobalStyles && inputGlobalStyles}
      <Root
        {...rootProps}
        {...(!(typeof Root === 'string') && {
          ownerState: { ...ownerState, ...rootProps.ownerState }
        })}
        ref={ref}
        onClick={handleClick}
        {...other}
        className={clsx(classes.root, rootProps.className, className)}
      >
        {startAdornment}
        <FormControlContext.Provider value={null}>
          <Input
            ownerState={ownerState}
            aria-invalid={fcs.error}
            aria-describedby={ariaDescribedby}
            autoComplete={autoComplete}
            autoFocus={autoFocus}
            defaultValue={defaultValue}
            disabled={fcs.disabled}
            id={id}
            onAnimationStart={handleAutoFill}
            name={name}
            placeholder={placeholder}
            readOnly={readOnly}
            required={fcs.required}
            rows={rows}
            value={value}
            onKeyDown={onKeyDown}
            onKeyUp={onKeyUp}
            type={type}
            {...inputProps}
            {...(!(typeof Input === 'string') && {
              as: InputComponent,
              ownerState: { ...ownerState, ...inputProps.ownerState }
            })}
            ref={handleInputRef}
            className={clsx(classes.input, inputProps.className)}
            onBlur={handleBlur}
            onChange={handleChange}
            onFocus={handleFocus}
          />
        </FormControlContext.Provider>
        {endAdornment}
        {renderSuffix
          ? renderSuffix({
              ...fcs,
              startAdornment
            })
          : null}
      </Root>
    </React.Fragment>
  );
});

InputBase.displayName = 'InputBase';

export default InputBase;
