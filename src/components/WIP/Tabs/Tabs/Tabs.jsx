import * as React from 'react';
import { useSlotProps } from '@components/lib';
import useTabs from '../useTabs';
import TabsProvider from '../useTabs/TabsProvider';

const useUtilityClasses = (ownerState) => {
  const { orientation } = ownerState;

  return {
    root: ['Tabs-Root', `Tabs-${orientation}`]
  };
};

const Tabs = React.forwardRef(function Tabs(props, forwardedRef) {
  const {
    children,
    value: valueProp,
    defaultValue,
    orientation = 'horizontal',
    direction = 'ltr',
    onChange,
    selectionFollowsFocus,
    slotProps = {},
    slots = {},
    ...other
  } = props;

  const { contextValue } = useTabs(props);

  const ownerState = {
    ...props,
    orientation,
    direction
  };

  const classes = useUtilityClasses(ownerState);

  const TabsRoot = slots.root ?? 'div';
  const tabsRootProps = useSlotProps({
    elementType: TabsRoot,
    externalSlotProps: slotProps.root,
    externalForwardedProps: other,
    additionalProps: {
      ref: forwardedRef
    },
    ownerState,
    className: classes.root
  });

  return (
    <TabsRoot {...tabsRootProps}>
      <TabsProvider value={contextValue}>{children}</TabsProvider>
    </TabsRoot>
  );
});

export default Tabs;
