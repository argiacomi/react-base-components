import * as React from 'react';
import { useSlotProps } from '@components/lib';
import useTabPanel from '../useTabPanel/useTabPanel';

const useUtilityClasses = (ownerState) => {
  const { hidden } = ownerState;

  return {
    root: ['TabPanel-Root', hidden && 'Hidden']
  };
};

const TabPanel = React.forwardRef(function TabPanel(props, forwardedRef) {
  const { children, value, slotProps = {}, slots = {}, ...other } = props;

  const { hidden, getRootProps } = useTabPanel(props);

  const ownerState = {
    ...props,
    hidden
  };

  const classes = useUtilityClasses(ownerState);

  const TabPanelRoot = slots.root ?? 'div';
  const tabPanelRootProps = useSlotProps({
    elementType: TabPanelRoot,
    getSlotProps: getRootProps,
    externalSlotProps: slotProps.root,
    externalForwardedProps: other,
    additionalProps: {
      role: 'tabpanel',
      ref: forwardedRef
    },
    ownerState,
    className: classes.root
  });

  return <TabPanelRoot {...tabPanelRootProps}>{!hidden && children}</TabPanelRoot>;
});

export default TabPanel;
