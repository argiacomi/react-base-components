import React from 'react';
import clsx from 'clsx';
import styled, { extractStyling, shouldForwardProp } from '@styles';
import { deepmerge, useForkRef } from '@components/lib';
import { formControlState, useFormControl } from '../../Form';
import Input, { FilledInput, OutlinedInput } from '../../Input';
import { NativeSelectInput } from '../NativeSelect';
import SelectInput from './SelectInput';
import ArrowDropDownIcon from '@icons/ArrowDropDown';

const StyledInput = styled(Input, {
  name: 'Select',
  shouldForwardProp: (prop) => shouldForwardProp(prop) && prop !== 'variant',
  slot: 'Root'
})(({ ownerState }) => ({ ...ownerState.cssStyles }));

const StyledOutlinedInput = styled(OutlinedInput, {
  name: 'Select',
  shouldForwardProp: (prop) => shouldForwardProp(prop) && prop !== 'variant',
  slot: 'Root'
})(({ ownerState }) => ({ ...ownerState.cssStyles }));

const StyledFilledInput = styled(FilledInput, {
  name: 'Select',
  shouldForwardProp: (prop) => shouldForwardProp(prop) && prop !== 'variant',
  slot: 'Root'
})(({ ownerState }) => ({ ...ownerState.cssStyles }));

const Select = React.forwardRef((props, ref) => {
  const {
    autoWidth = false,
    children,
    classes = {},
    className,
    defaultOpen = false,
    displayEmpty = false,
    IconComponent = ArrowDropDownIcon,
    id,
    input,
    inputProps,
    label,
    labelId,
    slotProps = {},
    multiple = false,
    native = false,
    onClose,
    onOpen,
    open,
    renderValue,
    SelectDisplayProps,
    variant: variantProp = 'outlined',
    ...otherProps
  } = props;

  const { cssStyles, other } = extractStyling(otherProps);

  const inputComponent = native ? NativeSelectInput : SelectInput;

  const formControl = useFormControl();
  const fcs = formControlState({
    props,
    formControl,
    states: ['variant', 'error']
  });

  const variant = fcs.variant || variantProp;

  const ownerState = { ...props, cssStyles, variant, classes };

  const InputComponent =
    input ||
    {
      standard: <StyledInput ownerState={ownerState} />,
      outlined: <StyledOutlinedInput label={label} ownerState={ownerState} />,
      filled: <StyledFilledInput ownerState={ownerState} />
    }[variant];

  const inputComponentRef = useForkRef(ref, InputComponent.ref);

  return (
    <React.Fragment>
      {React.cloneElement(InputComponent, {
        inputComponent,
        inputProps: {
          children,
          error: fcs.error,
          IconComponent,
          variant,
          type: undefined,
          multiple,
          ...(native
            ? { id }
            : {
                autoWidth,
                defaultOpen,
                displayEmpty,
                labelId,
                slotProps: slotProps.menu,
                onClose,
                onOpen,
                open,
                renderValue,
                SelectDisplayProps: { id, ...SelectDisplayProps }
              }),
          ...inputProps,
          classes: inputProps ? deepmerge(classes, inputProps.classes) : classes,
          ...(input ? input.props.inputProps : {})
        },
        ...(multiple && native && variant === 'outlined' ? { notched: true } : {}),
        ref: inputComponentRef,
        className: clsx(InputComponent.props.className, className),
        ...(!input && { variant }),
        ...other
      })}
    </React.Fragment>
  );
});

Select.displayName = 'Select';

export default Select;
