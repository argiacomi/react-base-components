import * as React from 'react';
import styled from '@styles';
import useSwitch from './useSwitch';
import { useSlotProps } from '@components/lib';
import { ButtonBase } from '@components/inputs';

const switchBaseClasses = {
  root: 'SwitchBase-Root',
  input: 'SwitchBase-Input',
  checked: 'Checked',
  disabled: 'Disabled'
};

const SwitchBaseRoot = styled(ButtonBase)(({ ownerState }) => ({
  padding: 9,
  borderRadius: '50%',
  ...(ownerState.edge === 'start' && {
    marginLeft: ownerState.size === 'small' ? -3 : -12
  }),
  ...(ownerState.edge === 'end' && {
    marginRight: ownerState.size === 'small' ? -3 : -12
  })
}));

const SwitchBaseInput = styled('input')({
  cursor: 'inherit',
  position: 'absolute',
  opacity: 0,
  width: '100%',
  height: '100%',
  top: 0,
  left: 0,
  margin: 0,
  padding: 0,
  zIndex: 1
});

const SwitchBase = React.forwardRef((props, ref) => {
  const {
    checkedIcon,
    edge = false,
    icon,
    inputProps: inputPropsProp,
    required = false,
    slotProps = {},
    slots = {},
    ...other
  } = props;

  const { getInputProps, checked, disabled, focusVisible, readOnly } = useSwitch({
    ...props,
    required
  });

  const ownerState = {
    ...props,
    checked,
    disabled,
    edge,
    focusVisible
  };

  const classes = {
    root: [
      switchBaseClasses.root,
      ownerState.checked && switchBaseClasses.checked,
      ownerState.disabled && switchBaseClasses.disabled
    ],
    input: switchBaseClasses.input
  };

  const Root = slots.root ?? SwitchBaseRoot;
  const rootProps = useSlotProps({
    elementType: Root,
    externalSlotProps: slotProps.root,
    externalForwardedProps: other,
    additionalProps: {
      centerRipple: true,
      component: 'span',
      ref: ref,
      tabIndex: null,
      role: undefined
    },
    ownerState,
    className: classes.root
  });

  const Input = slots.input ?? SwitchBaseInput;
  const inputProps = useSlotProps({
    elementType: Input,
    getSlotProps: getInputProps,
    externalSlotProps: slotProps.input,
    externalForwardedProps: inputPropsProp,
    ownerState,
    className: classes.input
  });

  return (
    <Root {...rootProps}>
      <Input {...inputProps} />
      {checked ? checkedIcon : icon}
    </Root>
  );
});

SwitchBase.displayName = 'SwitchBase';

export default SwitchBase;
