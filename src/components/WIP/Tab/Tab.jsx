import * as React from 'react';
import { useForkRef, useSlotProps } from '@components/lib';
import useTab from '../useTab';

const useUtilityClasses = (ownerState) => {
  const { selected, disabled } = ownerState;

  return {
    root: ['MuiTab-root', selected && 'Mui-selected', disabled && 'Mui-disabled']
  };
};

const Tab = React.forwardRef(function Tab(props, forwardedRef) {
  const {
    action,
    children,
    value: valueProp,
    disabled = false,
    onChange,
    onClick,
    onFocus,
    slotProps = {},
    slots = {},
    ...other
  } = props;

  const tabRef = React.useRef();
  const handleRef = useForkRef(tabRef, forwardedRef);

  const { active, highlighted, selected, getRootProps } = useTab({
    ...props,
    rootRef: handleRef
  });

  const ownerState = {
    ...props,
    active,
    disabled,
    highlighted,
    selected
  };

  const classes = useUtilityClasses(ownerState);

  const TabRoot = slots.root ?? 'button';
  const tabRootProps = useSlotProps({
    elementType: TabRoot,
    getSlotProps: getRootProps,
    externalSlotProps: slotProps.root,
    externalForwardedProps: other,
    additionalProps: {
      ref: forwardedRef
    },
    ownerState,
    className: classes.root
  });

  return <TabRoot {...tabRootProps}>{children}</TabRoot>;
});

export default Tab;
