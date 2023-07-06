import React from 'react';
import styled, { extractStyling } from '@styles';
import { useSlotProps } from '@components/lib';
import useTabs from './useTabs';
import TabsProvider from './useTabs/TabsProvider';

export const tabsClasses = {
  root: 'Tabs-Root',
  scroller: 'Tabs-Scroller',
  flexContainer: 'Tabs-FlexContainer',
  indicator: 'Tabs-Indicator',
  hideScrollbar: 'HideScrollbar',
  scrollButtons: 'Tabs-ScrollButtons',
  scrollButtonsHideMobile: 'ScrollButtonsHideMobile'
};

const TabsRoot = styled('div')(({ ownerState }) => ({ width: '100%', ...ownerState.cssStyles }));

const Tabs = React.forwardRef((props, ref) => {
  const {
    children,
    component = 'div',
    value: valueProp,
    defaultValue,
    orientation = 'horizontal',
    direction = 'ltr',
    onChange,
    selectionFollowsFocus,
    slotProps = {},
    slots = {},
    ...otherProps
  } = props;

  const { cssStyles, other } = extractStyling(otherProps);

  const { contextValue } = useTabs(props);

  const ownerState = {
    ...props,
    cssStyles,
    direction,
    orientation
  };

  const classes = {
    root: [tabsClasses.root, ownerState.vertical && tabsClasses.vertical],
    scroller: tabsClasses.scroller,
    flexContainer: [
      tabsClasses.flexContainer,
      ownerState.vertical && 'flexContainerVertical',
      ownerState.centered && 'centered'
    ],
    hideScrollbar: [ownerState.hideScrollbar && tabsClasses.hideScrollbar],
    indicator: tabsClasses.indicator,
    scrollButtons: [
      tabsClasses.scrollButtons,
      ownerState.scrollButtonsHideMobile && tabsClasses.scrollButtonsHideMobile
    ]
  };

  const TabsComponent = slots.root ?? TabsRoot;

  const tabsProps = useSlotProps({
    elementType: TabsComponent,
    externalSlotProps: slotProps.root,
    externalForwardedProps: other,
    additionalProps: {
      ref: ref
    },
    ownerState,
    className: classes.root
  });

  return (
    <TabsComponent as={component} {...tabsProps}>
      <TabsProvider value={contextValue}>{children}</TabsProvider>
    </TabsComponent>
  );
});

Tabs.displayName = 'Tabs';

export default Tabs;
