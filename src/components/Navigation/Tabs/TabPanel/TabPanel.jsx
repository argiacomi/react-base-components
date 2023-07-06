import React from 'react';
import styled, { extractStyling } from '@styles';
import { useSlotProps } from '@components/lib';
import useTabPanel from './useTabPanel';

export const tabPanelClasses = {
  root: 'TabPanel-Root',
  hidden: 'Hidden'
};

const TabPanelRoot = styled('div')(({ theme, ownerState }) => ({
  padding: theme.spacing(3),
  ...ownerState.cssStyles
}));

const TabPanel = React.forwardRef((props, ref) => {
  const { children, component, slotProps = {}, slots = {}, ...otherProps } = props;

  const { cssStyles, other } = extractStyling(otherProps);

  const { hidden, getRootProps } = useTabPanel(props);

  const ownerState = {
    ...props,
    cssStyles,
    hidden
  };

  const classes = {
    root: [tabPanelClasses.root, ownerState.hidden && tabPanelClasses.hidden]
  };

  const TabPanelComponent = slots.root ?? TabPanelRoot;

  const tabPanelRootProps = useSlotProps({
    elementType: TabPanelComponent,
    getSlotProps: getRootProps,
    externalSlotProps: slotProps.root,
    externalForwardedProps: other,
    additionalProps: {
      role: 'tabpanel',
      ref: ref
    },
    ownerState,
    className: classes.root
  });

  return (
    <TabPanelComponent as={component} {...tabPanelRootProps}>
      {!hidden && children}
    </TabPanelComponent>
  );
});

TabPanel.displayName = 'TabPanel';

export default TabPanel;
