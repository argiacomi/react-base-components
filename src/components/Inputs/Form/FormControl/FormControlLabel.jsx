import React from 'react';
import clsx from 'clsx';
import styled, { extractStyling } from '@styles';
import { useSlotProps } from '@components/lib';
import { Text } from '@components/display';
import { formControlState, useFormControl } from './FormControlContext';

export const formControlLabelClasses = {
  root: 'FormControlLabel-Root',
  asterisk: 'FormControlLabel-Asterisk',
  label: 'FormControlLabel-Label',
  disabled: 'Disabled',
  error: 'Error'
};

export const FormControlLabelRoot = styled('label')(({ theme, ownerState }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  cursor: 'pointer',
  verticalAlign: 'middle',
  WebkitTapHighlightColor: 'transparent',
  marginLeft: theme.pxToRem(-11),
  marginRight: theme.pxToRem(16),
  [`&.${formControlLabelClasses.disabled}`]: {
    cursor: 'default'
  },
  ...(ownerState.labelPlacement === 'start' && {
    flexDirection: 'row-reverse',
    marginLeft: theme.pxToRem(16),
    marginRight: theme.pxToRem(-11)
  }),
  ...(ownerState.labelPlacement === 'top' && {
    flexDirection: 'column-reverse',
    marginLeft: theme.pxToRem(16)
  }),
  ...(ownerState.labelPlacement === 'bottom' && {
    flexDirection: 'column',
    marginLeft: theme.pxToRem(16)
  }),
  [`& .${formControlLabelClasses.label}`]: {
    [`&.${formControlLabelClasses.disabled}`]: {
      color: theme.color.disabled.text
    }
  },
  ...ownerState.cssStyles
}));

const AsteriskComponent = styled('span')(({ theme }) => ({
  [`&.${formControlLabelClasses.error}`]: {
    color: theme.color.danger.body
  }
}));

const FormControlLabel = React.forwardRef((props, ref) => {
  const {
    checked,
    component: componentProp = 'label',
    control,
    disabled: disabledProp,
    disableText,
    inputRef,
    label: labelProp,
    labelPlacement = 'end',
    name,
    onChange,
    required: requiredProp,
    slots = {},
    slotProps = {},
    value,
    ...otherProps
  } = props;

  const { cssStyles, other } = extractStyling(otherProps);

  const formControl = useFormControl();

  const disabled = disabledProp ?? control.props.disabled ?? formControl?.disabled;
  const required = requiredProp ?? control.props.required;

  const controlProps = {
    disabled,
    required
  };

  ['checked', 'name', 'onChange', 'value', 'inputRef'].forEach((key) => {
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
    cssStyles,
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
      <Text
        component='span'
        {...textSlotProps}
        className={clsx(classes.label, textSlotProps?.className)}
      >
        {label}
      </Text>
    );
  }

  const component = componentProp ?? 'label';
  const FormControlLabelRootComponent = slots.root ?? FormControlLabelRoot;

  const formControlLabelRootprops = useSlotProps({
    elementType: FormControlLabelRootComponent,
    externalSlotProps: slotProps.root,
    externalForwardedProps: other,
    additionalProps: {
      ref: ref
    },
    ownerState,
    className: classes.root
  });

  return (
    <FormControlLabelRootComponent as={component} {...formControlLabelRootprops}>
      {React.cloneElement(control, controlProps)}
      {label}
      {required && (
        <AsteriskComponent ownerState={ownerState} aria-hidden className={classes.asterisk}>
          &thinsp;{'*'}
        </AsteriskComponent>
      )}
    </FormControlLabelRootComponent>
  );
});

FormControlLabel.displayName = 'FormControlLabel';

export default FormControlLabel;
