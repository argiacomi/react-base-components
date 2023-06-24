import React from 'react';
import clsx from 'clsx';
import styled from '@styles';
import { formControlState, useFormControl } from './FormControlContext';
import { Text } from '@components/layout';

export const formControlLabelClasses = {
  root: 'FormControlLabel-Root',
  asterisk: 'FormControlLabel-Asterisk',
  disabled: 'FormControlLabel-Disabled',
  error: 'FormControlLabel-Error',
  label: 'FormControlLabel-Label'
};

export const FormControlLabelRoot = styled('label')(({ theme, ownerState }) => ({
  display: 'inline-flex',
  width: 'max-content',
  alignItems: 'center',
  cursor: 'pointer',
  verticalAlign: 'middle',
  WebkitTapHighlightColor: 'transparent',
  marginLeft: theme.spacing(-11 / 8),
  marginRight: theme.spacing(2),
  [`&.${formControlLabelClasses.disabled}`]: {
    cursor: 'default'
  },
  ...(ownerState.labelPlacement === 'start' && {
    flexDirection: 'row-reverse',
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(-11 / 8)
  }),
  ...(ownerState.labelPlacement === 'top' && {
    flexDirection: 'column-reverse',
    marginLeft: theme.spacing(2)
  }),
  ...(ownerState.labelPlacement === 'bottom' && {
    flexDirection: 'column',
    marginLeft: theme.spacing(2)
  }),
  [`& .${formControlLabelClasses.label}`]: {
    [`&.${formControlLabelClasses.disabled}`]: {
      color: theme.color.disabled.text
    }
  }
}));

const AsteriskComponent = styled('span')(({ theme }) => ({
  [`&.${formControlLabelClasses.error}`]: {
    color: theme.color.danger.body
  }
}));

const FormControlLabel = React.forwardRef((props, ref) => {
  const {
    className,
    control,
    disabled: disabledProp,
    disableText,
    label: labelProp,
    labelPlacement = 'end',
    required: requiredProp,
    slotProps = {},
    ...other
  } = props;

  const formControl = useFormControl();

  const disabled = disabledProp ?? control.props.disabled ?? formControl?.disabled;
  const required = requiredProp ?? control.props.required;

  const controlProps = {
    disabled,
    required,
    className: control.props.className
  };

  [('checked', 'name', 'onChange', 'value', 'inputRef')].forEach((key) => {
    if (typeof control.props[key] === 'undefined' && typeof props[key] !== 'undefined') {
      controlProps[key] = props[key];
    }
  });

  const fcs = formControlState({
    props,
    formControl,
    states: ['error']
  });

  const ownerState = {
    ...props,
    disabled,
    labelPlacement,
    required,
    error: fcs.error
  };

  const classes = {
    root: [
      formControlLabelClasses.root,
      ownerState.disabled && formControlLabelClasses.disabled,
      ownerState.error && formControlLabelClasses.error,
      ownerState.required && formControlLabelClasses.required
    ],
    label: [formControlLabelClasses.label, ownerState.disabled && formControlLabelClasses.disabled],
    asterisk: [formControlLabelClasses.asterisk, ownerState.error && formControlLabelClasses.error]
  };

  const textSlotProps = slotProps.text;

  let label = labelProp;
  if (label != null && label.type !== Text && !disableText) {
    label = (
      <Text {...textSlotProps} className={clsx(classes.label, textSlotProps?.className)}>
        {label}
      </Text>
    );
  }

  return (
    <FormControlLabelRoot
      className={clsx(classes.root, className)}
      ownerState={ownerState}
      ref={ref}
      {...other}
    >
      {React.cloneElement(control, controlProps)}
      {label}
      {required && (
        <AsteriskComponent ownerState={ownerState} aria-hidden className={classes.asterisk}>
          &thinsp;{'*'}
        </AsteriskComponent>
      )}
    </FormControlLabelRoot>
  );
});

FormControlLabel.displayName = 'FormControlLabel';

export default FormControlLabel;
