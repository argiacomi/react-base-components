import React from 'react';
import clsx from 'clsx';
import { styled } from '@styles';
import { useFormControl, formControlState } from '../FormControl';

const FormGroupRoot = styled('div')(({ ownerState }) => ({
  display: 'flex',
  flexDirection: 'column',
  flexWrap: 'wrap',
  ...(ownerState.row && {
    flexDirection: 'row'
  })
}));

const FormGroup = React.forwardRef((props, ref) => {
  const { className, row = false, ...other } = props;

  const formControl = useFormControl();

  const fcs = formControlState({
    props,
    formControl,
    states: ['error']
  });

  const ownerState = { ...props, row, error: fcs.error };

  return (
    <FormGroupRoot
      className={clsx('FormGroup-Root', className)}
      ownerState={ownerState}
      ref={ref}
      {...other}
    />
  );
});

FormGroup.displayName = 'FormGroup';

export default FormGroup;
