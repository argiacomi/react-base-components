import React from 'react';
import clsx from 'clsx';
import { formControlState, useFormControl } from '../../Form';
import Input from '../../Input';
import NativeSelectInput from './NativeSelectInput';
import ArrowDropDownIcon from '@icons/ArrowDropDown';

export const nativeSelectClasses = {
  root: 'NativeSelect-Root'
};

const defaultInput = <Input />;

const NativeSelect = React.forwardRef((props, ref) => {
  const {
    className,
    children,
    classes: classesProp = {},
    IconComponent = ArrowDropDownIcon,
    input = defaultInput,
    inputProps,
    variant,
    ...other
  } = props;

  const formControl = useFormControl();
  const fcs = formControlState({
    props,
    formControl,
    states: ['variant']
  });

  const ownerState = { ...props, classes: classesProp };
  const { root, ...otherClasses } = classesProp;

  return (
    <React.Fragment>
      {React.cloneElement(input, {
        inputComponent: NativeSelectInput,
        inputProps: {
          children,
          classes: otherClasses,
          IconComponent,
          variant: fcs.variant,
          type: undefined,
          ...inputProps,
          ...(input ? input.props.inputProps : {})
        },
        ref,
        ...other,
        className: clsx(nativeSelectClasses.root, input.props.className, className)
      })}
    </React.Fragment>
  );
});

NativeSelect.displayName = 'NativeSelect';

export default NativeSelect;
