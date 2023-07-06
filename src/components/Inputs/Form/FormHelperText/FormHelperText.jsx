import React from 'react';
import styled, { extractStyling } from '@styles';
import { useSlotProps } from '@components/lib';
import { formControlState, useFormControl } from '../FormControl';

export const formHelperTextClasses = {
  root: 'FormHelperText-Root',
  error: 'FormHelperText-Error',
  disabled: 'FormHelperText-Disabled'
};

const FormHelperTextRoot = styled('p')(({ theme, ownerState }) => ({
  color: theme.color.text.secondary,
  ...theme.text.typography.caption,
  textAlign: 'left',
  marginTop: theme.spacing(3 / 8),
  marginRight: 0,
  marginBottom: 0,
  marginLeft: 0,
  [`&.${formHelperTextClasses.disabled}`]: {
    color: theme.color.disabled.text
  },
  [`&.${formHelperTextClasses.error}`]: {
    color: theme.color.danger.body
  },
  ...(ownerState.size === 'small' && {
    marginTop: theme.spacing(0.5)
  }),
  ...(ownerState.contained && {
    marginLeft: theme.spacing(14 / 8),
    marginRight: theme.spacing(14 / 8)
  }),
  ...ownerState.cssStyles
}));

const FormHelperText = React.forwardRef((props, ref) => {
  const {
    children,
    component: componentProp = 'p',
    slots = {},
    slotProps = {},
    ...otherProps
  } = props;

  const { cssStyles, other } = extractStyling(otherProps);

  const formControl = useFormControl();
  const fcs = formControlState({
    props,
    formControl,
    states: ['variant', 'size', 'disabled', 'error', 'filled', 'focused', 'required']
  });

  const ownerState = {
    ...props,
    cssStyles,
    contained: fcs.variant === 'filled' || fcs.variant === 'outlined',
    variant: fcs.variant,
    size: fcs.size,
    disabled: fcs.disabled,
    error: fcs.error,
    filled: fcs.filled,
    focused: fcs.focused,
    required: fcs.required
  };

  const classes = {
    root: [
      formHelperTextClasses.root,
      ownerState.disabled && formHelperTextClasses.disabled,
      ownerState.error && formHelperTextClasses.error
    ]
  };

  const component = componentProp ?? 'p';
  const FormHelperTextRootComponent = slots.root ?? FormHelperTextRoot;
  const formHelperTextRootprops = useSlotProps({
    elementType: FormHelperTextRootComponent,
    externalSlotProps: slotProps.root,
    externalForwardedProps: other,
    additionalProps: {
      ref: ref
    },
    ownerState,
    className: classes.root
  });

  return (
    <FormHelperTextRootComponent as={component} {...formHelperTextRootprops}>
      {children === ' ' ? <span className='notranslate'>&#8203;</span> : children}
    </FormHelperTextRootComponent>
  );
});

FormHelperText.displayName = 'FormHelperText';

export default FormHelperText;
