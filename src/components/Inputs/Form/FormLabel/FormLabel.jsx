import React from 'react';
import clsx from 'clsx';
import styled from '@styles';
import { formControlState, useFormControl } from '../FormControl';

export const formLabelClasses = {
  root: 'FormLabel-Root',
  disabled: 'FormLabel-Disabled',
  error: 'FormLabel-Error',
  focused: 'FormLabel-Focused'
};

export const FormLabelRoot = styled('label')(({ theme, ownerState }) => ({
  color: theme.color.text.secondary,
  ...theme.text.typography.body1,
  lineHeight: '1.4375em',
  padding: 0,
  position: 'relative',
  [`&.${formLabelClasses.focused}`]: {
    color: theme.color[ownerState.color].body
  },
  [`&.${formLabelClasses.disabled}`]: {
    color: theme.color.disabled.text
  },
  [`&.${formLabelClasses.error}`]: {
    color: theme.color.danger.body
  }
}));

const AsteriskComponent = styled('span')(({ theme }) => ({
  [`&.${formLabelClasses.error}`]: {
    color: theme.color.danger.body
  }
}));

const FormLabel = React.forwardRef((props, ref) => {
  const { children, className, component = 'label', ...other } = props;

  const formControl = useFormControl();

  const fcs = formControlState({
    props,
    formControl,
    states: ['color', 'required', 'focused', 'disabled', 'error', 'filled']
  });

  const ownerState = {
    ...props,
    color: fcs.color || 'primary',
    component,
    disabled: fcs.disabled,
    error: fcs.error,
    filled: fcs.filled,
    focused: fcs.focused,
    required: fcs.required
  };

  const classes = {
    root: [
      formLabelClasses.root,
      ownerState.disabled && formLabelClasses.disabled,
      ownerState.error && formLabelClasses.error,
      ownerState.focused && formLabelClasses.focused
    ],
    asterisk: [formLabelClasses.asterisk, ownerState.error && formLabelClasses.error]
  };

  return (
    <FormLabelRoot
      as={component}
      ownerState={ownerState}
      className={clsx(classes.root, className)}
      ref={ref}
      {...other}
    >
      {children}
      {fcs.required && (
        <AsteriskComponent ownerState={ownerState} aria-hidden className={classes.asterisk}>
          &thinsp;{'*'}
        </AsteriskComponent>
      )}
    </FormLabelRoot>
  );
});

FormLabel.displayName = 'FormLabel';

export default FormLabel;
