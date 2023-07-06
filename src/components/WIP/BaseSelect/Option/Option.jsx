import React from 'react';
import { useForkRef, useSlotProps } from '@components/lib';
import useOption from './useOption';

export const optionClasses = {
  root: 'Option-Root',
  disabled: 'Disabled',
  highlighted: 'Highlighted',
  selected: 'Selected'
};

const Option = React.forwardRef((props, ref) => {
  const { children, disabled = false, label, slotProps = {}, slots = {}, value, ...other } = props;

  const Root = slots.root ?? 'li';

  const optionRef = React.useRef(null);
  const combinedRef = useForkRef(optionRef, ref);

  const computedLabel =
    label ?? (typeof children === 'string' ? children : optionRef.current?.innerText);

  const { getRootProps, selected, highlighted, index } = useOption({
    disabled,
    label: computedLabel,
    rootRef: combinedRef,
    value
  });

  const ownerState = {
    ...props,
    disabled,
    highlighted,
    index,
    selected
  };

  const classes = {
    root: [
      optionClasses.root,
      ownerState.disabled && optionClasses.disabled,
      ownerState.highlighted && optionClasses.highlighted,
      ownerState.selected && optionClasses.selected
    ]
  };

  const rootProps = useSlotProps({
    getSlotProps: getRootProps,
    elementType: Root,
    externalSlotProps: slotProps.root,
    externalForwardedProps: other,
    className: classes.root,
    ownerState
  });

  return <Root {...rootProps}>{children}</Root>;
});

Option.displayName = 'Option';

export default Option;
