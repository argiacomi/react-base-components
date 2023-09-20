import React from 'react';
import clsx from 'clsx';
import styled, { GlobalStyles } from '@styles';
import { useSlotProps } from '@components/lib';
import { FormControlContext, formControlState } from '@components/Inputs/Form';
import TextareaAutosize from '../InputHelpers/TextareaAutosize';
import useInputBase from './useInputBase';

export const inputBaseClasses = {
  root: 'InputBase-Root',
  input: 'InputBase-Input',
  disabled: 'Disabled',
  error: 'Error',
  focused: 'Focused',
  formControl: 'FormControl'
};

export const InputBaseRoot = styled('div')(({ theme, ownerState }) => ({
  ...theme.text.typography.body1,
  color: theme.color.text.primary,
  lineHeight: theme.spacing(23 / 8),
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
  const placeholder = {
    color: 'currentColor',
    opacity: 0.42,
    transition: theme.transition.create('opacity', {
      duration: theme.transition.duration.shorter
    }),
    '@media (prefers-color-scheme: dark)': {
      opacity: 0.5
    }
  };

  const placeholderHidden = {
    opacity: '0 !important'
  };

  const lightPlaceholderVisible = { opacity: 0.42 };
  const darkPlaceholderVisible = { opacity: 0.5 };

  return {
    font: 'inherit',
    letterSpacing: 'inherit',
    color: 'currentColor',
    padding: '4px 0 5px',
    border: 0,
    boxSizing: 'content-box',
    background: 'none',
    height: '1.4375em',
    margin: 0,
    WebkitTapHighlightColor: 'transparent',
    display: 'block',
    minWidth: 0,
    width: '100%',
    animationName: 'auto-fill-cancel',
    animationDuration: '10ms',
    '&::-webkit-input-placeholder': placeholder,
    '&::-moz-placeholder': placeholder,
    '&:-ms-input-placeholder': placeholder,
    '&::-ms-input-placeholder': placeholder,
    '&:focus': {
      outline: 0
    },
    '&:invalid': {
      boxShadow: 'none'
    },
    '&::-webkit-search-decoration': {
      WebkitAppearance: 'none'
    },
    [`label[data-shrink=false] + .${inputBaseClasses.formControl} &`]: {
      '&::-webkit-input-placeholder': placeholderHidden,
      '&::-moz-placeholder': placeholderHidden,
      '&:-ms-input-placeholder': placeholderHidden,
      '&::-ms-input-placeholder': placeholderHidden,
      '&:focus::-webkit-input-placeholder': lightPlaceholderVisible,
      '&:focus::-moz-placeholder': lightPlaceholderVisible,
      '&:focus:-ms-input-placeholder': lightPlaceholderVisible,
      '&:focus::-ms-input-placeholder': lightPlaceholderVisible
    },
    '@media (prefers-color-scheme: dark)': {
      [`label[data-shrink=false] + .${inputBaseClasses.formControl} &`]: {
        '&:focus::-webkit-input-placeholder': darkPlaceholderVisible,
        '&:focus::-moz-placeholder': darkPlaceholderVisible,
        '&:focus:-ms-input-placeholder': darkPlaceholderVisible,
        '&:focus::-ms-input-placeholder': darkPlaceholderVisible
      }
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
    disableInjectingGlobalStyles,
    endAdornment,
    error,
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

  const {
    checkDirty,
    focused,
    formControl,
    getInputProps,
    getRootProps,
    handleInputRef,
    inputRef,
    value
  } = useInputBase(props);

  const fcs = formControlState({
    props,
    formControl,
    states: ['color', 'disabled', 'error', 'hiddenLabel', 'size', 'required', 'filled']
  });

  fcs.focused = formControl ? formControl.focused : focused;

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
    error: error || fcs.error,
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
  const rootProps = useSlotProps({
    elementType: Root,
    getSlotProps: getRootProps,
    externalSlotProps: slotProps.root || {},
    externalForwardedProps: other,
    ownerState,
    className: [classes.root, className]
  });

  const Input = slots.input || InputBaseComponent;

  inputProps = useSlotProps({
    elementType: InputComponent,
    getSlotProps: (otherHandlers) => {
      return getInputProps({
        ...otherHandlers
      });
    },
    externalSlotProps: { ...inputProps, ...slotProps.input },
    ownerState,
    className: classes.input
  });

  const sanitizedValue = type === 'number' && isNaN(value) ? 0 : value;

  return (
    <React.Fragment>
      {!disableInjectingGlobalStyles && inputGlobalStyles}
      <Root
        {...rootProps}
        {...(!(typeof Root === 'string') && {
          ownerState: { ...ownerState, ...rootProps.ownerState }
        })}
        ref={ref}
        {...other}
        className={clsx(classes.root, rootProps.className, className)}
      >
        {startAdornment}
        <FormControlContext.Provider value={null}>
          <Input
            ownerState={ownerState}
            aria-invalid={error || fcs.error}
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
            value={sanitizedValue}
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
