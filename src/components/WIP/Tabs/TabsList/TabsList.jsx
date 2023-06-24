import * as React from 'react';
import { useSlotProps } from '@components/lib';
import useTabsList from '../useTabsList';
import TabsListProvider from '../useTabsList/TabsListProvider';

const useUtilityClasses = (ownerState) => {
  const { orientation } = ownerState;

  return {
    root: ['TabsList-root', `TabsList-${orientation}`]
  };
};

const TabsList = React.forwardRef(function TabsList(props, forwardedRef) {
  const { children, slotProps = {}, slots = {}, ...other } = props;

  const { isRtl, orientation, getRootProps, contextValue } = useTabsList({
    rootRef: forwardedRef
  });

  const ownerState = {
    ...props,
    isRtl,
    orientation
  };

  const classes = useUtilityClasses(ownerState);

  const TabsListRoot = slots.root ?? 'div';
  const tabsListRootProps = useSlotProps({
    elementType: TabsListRoot,
    getSlotProps: getRootProps,
    externalSlotProps: slotProps.root,
    externalForwardedProps: other,
    ownerState,
    className: classes.root
  });

  return (
    <TabsListProvider value={contextValue}>
      <TabsListRoot {...tabsListRootProps}>{children}</TabsListRoot>
    </TabsListProvider>
  );
});

export default TabsList;
