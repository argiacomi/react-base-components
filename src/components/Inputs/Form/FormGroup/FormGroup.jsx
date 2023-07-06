import React from 'react';
import styled, { extractStyling } from '@styles';
import { useSlotProps } from '@components/lib';
import { formControlState, useFormControl } from '../FormControl';

export const formGroupClasses = { root: 'FormGroup-Root', row: 'Row', error: 'Error' };

const FormGroupRoot = styled('div')(({ ownerState }) => ({
  display: 'flex',
  flexDirection: 'column',
  flexWrap: 'wrap',
  ...(ownerState.row && {
    flexDirection: 'row'
  }),
  ...ownerState.cssStyles
}));

const FormGroup = React.forwardRef((props, ref) => {
  const {
    component: componentProp = 'div',
    row = false,
    slots = {},
    slotProps = {},
    ...otherProps
  } = props;

  const { cssStyles, other } = extractStyling(otherProps);

  const formControl = useFormControl();

  const fcs = formControlState({
    props,
    formControl,
    states: ['error']
  });

  const ownerState = { ...props, cssStyles, row, error: fcs.error };

  const classes = {
    root: [
      formGroupClasses.root,
      ownerState.row && formGroupClasses.row,
      ownerState.error && formGroupClasses.error
    ]
  };

  const component = componentProp ?? 'div';
  const FormGroupRootComponent = slots.root ?? FormGroupRoot;
  const formGroupRootprops = useSlotProps({
    elementType: FormGroupRootComponent,
    externalSlotProps: slotProps.root,
    externalForwardedProps: other,
    additionalProps: {
      ref: ref
    },
    ownerState,
    className: classes.root
  });

  return <FormGroupRootComponent as={component} {...formGroupRootprops} />;
});

FormGroup.displayName = 'FormGroup';

export default FormGroup;
