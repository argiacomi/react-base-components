import React from 'react';
import clsx from 'clsx';
import { styled, GlobalStyles } from '@styles';
import useInputBase from './useInputBase';
import TextareaAutosize from '../InputHelpers/TextareaAutosize';
import { FormControlContext } from '@components/Inputs/Form';
import { useSlotProps } from '@components/lib';

export const inputBaseClasses = {
  root: 'InputBase-Root',
  input: 'InputBase-Input',
  disabled: 'InputBase-Disabled',
  error: 'InputBase-Error',
  focused: 'InputBase-Focused',
  formControl: 'InputBase-FormControl'
};

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
    classes: classesProp = {},
    defaultValue = false,
    disabled: disabledProp,
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
    size,
    slotProps = {},
    slots = {},
    startAdornment,
    type = 'text',
    value: valueProp,
    ...other
  } = props;

  const {
    checkDirty,
    color,
    disabled,
    error,
    filled,
    focused,
    formControl,
    getInputProps,
    getRootProps,
    handleInputRef,
    hiddenLabel,
    inputRef,
    required,
    value
  } = useInputBase(
    defaultValue,
    disabledProp,
    inputPropsProp,
    inputRefProp,
    onBlur,
    onChange,
    onClick,
    onFocus,
    valueProp
  );

  let InputComponent = inputComponent;
  let inputProps = inputPropsProp;

  if (multiline && InputComponent === 'input') {
    if (rows) {
      if (!import.meta.env.PROD) {
        if (minRows || maxRows) {
          console.warn(
            `You can not use the 'minRows'' or 'maxRows' props when the input 'rows' prop is set.`
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
    checkDirty(event.animationName === 'mui-auto-fill-cancel' ? inputRef.current : { value: 'x' });
  };

  React.useEffect(() => {
    if (formControl) {
      formControl.setAdornedStart(Boolean(startAdornment));
    }
  }, [formControl, startAdornment]);

  const ownerState = {
    ...props,
    color,
    disabled,
    endAdornment,
    error,
    focused,
    formControl,
    fullWidth,
    hiddenLabel,
    multiline,
    size,
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

  const Root = slots.root || InputBaseRoot;
  const rootProps = useSlotProps({
    elementType: Root,
    getSlotProps: getRootProps,
    externalSlotProps: slotProps.root || {},
    externalForwardedProps: other,
    additionalProps: {
      ref: ref
    },
    ownerState,
    className: clsx([(classes.root, slotProps.root.className, className)])
  });

  const Input = slots.input || InputBaseComponent;

  inputProps = useSlotProps({
    elementType: Input,
    getSlotProps: (otherHandlers) => {
      return getInputProps({
        ...propsToForward,
        ...otherHandlers
      });
    },
    externalSlotProps: { ...inputProps, ...slotProps.input },
    additionalProps: {
      rows: multiline ? rows : undefined,
      ...(multiline &&
        !(typeof Input === 'string') && {
          as: InputComponent,
          ownerState: { ...ownerState, ...inputProps.ownerState }
        })
    },
    ownerState,
    className: clsx([(classes.input, inputProps.className)])
  });

  const fcs = {
    color,
    disabled,
    error,
    filled,
    hiddenLabel,
    required,
    size
  };

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
      >
        {startAdornment}
        <FormControlContext.Provider value={null}>
          <Input
            ownerState={ownerState}
            aria-invalid={error}
            defaultValue={defaultValue}
            disabled={disabled}
            onAnimationStart={handleAutoFill}
            required={required}
            rows={rows}
            value={value}
            ref={handleInputRef}
            {...inputProps}
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
