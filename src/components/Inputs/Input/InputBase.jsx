import React from 'react';
import clsx from 'clsx';
import { styled, GlobalStyles } from '@styles';
import useInputBase from './useInputBase';
import TextareaAutosize from './TextareaAutosize';
import { FormControlContext, formControlState, useFormControl } from '../Form/FormControl';
import { useEnhancedEffect, useSlotProps, createChainedFunction } from '@components/lib';

const inputBaseClasses = {
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
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledby,
    autoComplete,
    autoFocus,
    className,
    defaultValue,
    disabled: disabledProp,
    disableInjectingGlobalStyles,
    endAdornment,
    error: errorProp,
    fullWidth = false,
    id,
    inputComponent = 'input',
    inputProps: inputPropsProp = {},
    inputRef: inputRefProp,
    maxRows,
    minRows,
    multiline = false,
    name,
    onBlur: onBlurProp,
    onChange: onChangeProp,
    onClick,
    onFocus: onFocusProp,
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

  const onFocus = createChainedFunction([onFocusProp, inputPropsProp.onFocus]);
  const onBlur = createChainedFunction([onBlurProp, inputPropsProp.onBlur]);
  const onChange = createChainedFunction([onChangeProp, inputPropsProp.onChange]);

  const formControlContext = useFormControl();

  const fcs = formControlState({
    props,
    formControlContext,
    states: ['color', 'disabled', 'error || error', 'hiddenLabel', 'size', 'required', 'filled']
  });

  const onFilled = formControlContext && formControlContext.onFilled;
  const onEmpty = formControlContext && formControlContext.onEmpty;

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

  const {
    disabled,
    error,
    focused,
    formControl,
    getInputProps,
    getRootProps,
    inputRef,
    isControlled,
    required,
    value
  } = useInputBase({
    checkDirty,
    defaultValue,
    disabled: disabledProp,
    error: errorProp,
    inputProps: inputPropsProp,
    inputRef: inputRefProp,
    onBlur,
    onChange,
    onClick,
    onFocus,
    onKeyDown,
    onKeyUp,
    slotProps,
    slots,
    value: valueProp
  });

  if (!import.meta.env.PROD) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    React.useEffect(() => {
      if (formControl) {
        return formControl.registerEffect();
      }

      return undefined;
    }, [formControl]);
  }

  fcs.focused = formControl ? formControl.focused : focused;

  useEnhancedEffect(() => {
    if (isControlled) {
      checkDirty({ value });
    }
  }, [value, checkDirty, isControlled]);

  React.useEffect(() => {
    checkDirty(inputRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let InputComponent = inputComponent;

  if (multiline && InputComponent === 'input') {
    if (rows) {
      if (!import.meta.env.PROD) {
        if (minRows || maxRows) {
          console.warn(
            `You can not use the 'minRows' or 'maxRows' props when the input 'rows' prop is set.`
          );
        }
      }
    }
    InputComponent = TextareaAutosize;
  }

  React.useEffect(() => {
    if (formControl) {
      formControl.setAdornedStart(Boolean(startAdornment));
    }
  }, [formControl, startAdornment]);

  const ownerState = {
    ...props,
    color: fcs.color || 'primary',
    disabled: fcs.disabled || disabled,
    endAdornment,
    error: fcs.error || error,
    focused: fcs.focused || focused,
    formControl: formControl,
    fullWidth,
    hiddenLabel: fcs.hiddenLabel,
    multiline,
    size: fcs.size,
    startAdornment,
    type
  };

  const classes = {
    root: [
      inputBaseClasses.root,
      ownerState.disabled && inputBaseClasses.disabled,
      ownerState.formControl && inputBaseClasses.formControl
    ],
    input: 'InputBase-Input'
  };

  const Root = slots.root || InputBaseRoot;

  const rootProps = useSlotProps({
    elementType: Root,
    getSlotProps: getRootProps,
    externalSlotProps: slotProps.root,
    externalForwardedProps: other,
    additionalProps: {
      ref: ref
    },
    ownerState,
    className: [classes.root, className]
  });
  const Input = slots.input || InputBaseComponent;

  const propsToForward = {
    'aria-describedby': ariaDescribedby,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledby,
    autoComplete,
    autoFocus,
    id,
    onKeyDown,
    onKeyUp,
    name,
    placeholder,
    readOnly,
    type
  };

  const inputProps = useSlotProps({
    elementType: Input,
    getSlotProps: (otherHandlers) => getInputProps({ ...otherHandlers, ...propsToForward }),
    externalSlotProps: slotProps.input,
    additionalProps: {
      rows: multiline ? rows : undefined,
      ...(multiline &&
        !(typeof Input === 'string') && {
          minRows: rows || minRows,
          maxRows: rows || maxRows
        })
    },
    ownerState,
    className: classes.input
  });

  return (
    <React.Fragment>
      {!disableInjectingGlobalStyles && inputGlobalStyles}
      <Root
        {...rootProps}
        {...(!(typeof Root === 'string') && {
          ownerState: { ...ownerState, ...rootProps.ownerState }
        })}
        ref={inputRef}
        {...other}
        className={clsx(classes.root, rootProps.className, className)}
      >
        {startAdornment}
        <FormControlContext.Provider value={null}>
          <Input
            ownerState={ownerState}
            aria-invalid={fcs.error || error}
            aria-describedby={ariaDescribedby}
            autoComplete={autoComplete}
            autoFocus={autoFocus}
            defaultValue={defaultValue}
            disabled={fcs.disabled || disabled}
            id={id}
            name={name}
            placeholder={placeholder}
            readOnly={readOnly}
            required={fcs.required || required}
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
            ref={inputRef}
            className={clsx(classes.input, inputProps.className)}
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
