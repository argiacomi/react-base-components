import React from 'react';
import clsx from 'clsx';
import styled from '@styles';
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
  })
}));

const FormHelperText = React.forwardRef((props, ref) => {
  const { children, className, component = 'p', ...other } = props;

  const formControl = useFormControl();
  const fcs = formControlState({
    props,
    formControl,
    states: ['variant', 'size', 'disabled', 'error', 'filled', 'focused', 'required']
  });

  const ownerState = {
    ...props,
    component,
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

  return (
    <FormHelperTextRoot
      as={component}
      ownerState={ownerState}
      className={clsx(classes.root, className)}
      ref={ref}
      {...other}
    >
      {children === ' ' ? <span className='notranslate'>&#8203;</span> : children}
    </FormHelperTextRoot>
  );
});

FormHelperText.displayName = 'FormHelperText';

export default FormHelperText;
