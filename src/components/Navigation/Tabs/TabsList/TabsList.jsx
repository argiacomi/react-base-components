import React from 'react';
import { isFragment } from 'react-is';
import styled, { extractStyling, useTheme } from '@styles';
import clsx from 'clsx';
import {
  animate,
  debounce,
  detectScrollType,
  getNormalizedScrollLeft,
  ownerWindow,
  useEventCallback,
  useSlotProps,
  useScrollbarSize
} from '@components/lib';
import useTabsList from './useTabsList';
import TabsListProvider from './useTabsList/TabsListProvider';
import TabScrollButton from './TabScrollButton';

export const tabsListClasses = {
  root: 'TabsList-Root',
  flexContainer: 'Tabs-FlexContainer',
  indicator: ['Tabs-Indicator'],
  scroller: 'TabsList-Scroller',
  scrollButtons: 'TabsList-ScrollButtons',
  fixed: 'Fixed',
  hideScrollbar: 'HideScrollbar',
  scrollableX: 'ScrollableX',
  scrollableY: 'ScrollableY',
  scrollButtonsHideMobile: 'ScrollButtonsHideMobile',
  horizontal: 'Horizontal',
  vertical: 'Vertical'
};

const TabsListRoot = styled('div')(({ ownerState, theme }) => ({
  overflow: 'hidden',
  minHeight: 48,
  WebkitOverflowScrolling: 'touch',
  display: 'flex',
  ...(ownerState.vertical && {
    flexDirection: 'column'
  }),
  ...(ownerState.scrollButtonsHideMobile && {
    [`& .${tabsListClasses.scrollButtons}`]: {
      [theme.breakpoints.down('sm')]: {
        display: 'none'
      }
    }
  }),
  ...ownerState.cssStyles
}));

const TabsScroller = styled('div')(({ ownerState }) => ({
  position: 'relative',
  display: 'inline-block',
  flex: '1 1 auto',
  whiteSpace: 'nowrap',
  ...(ownerState.fixed && {
    overflowX: 'hidden',
    width: '100%'
  }),
  ...(ownerState.hideScrollbar && {
    '-ms-overflow-style': 'none', // IE 10+
    scrollbarWidth: 'none', // Firefox
    '&::-webkit-scrollbar': {
      display: 'none' // Safari + Chrome
    }
  }),
  ...(ownerState.scrollableX && {
    overflowX: 'auto',
    overflowY: 'hidden'
  }),
  ...(ownerState.scrollableY && {
    overflowX: 'hidden',
    overflowY: 'auto'
  })
}));

const FlexContainer = styled('div')(({ ownerState }) => ({
  display: 'flex',
  ...(ownerState.vertical && {
    flexDirection: 'column'
  }),
  ...(ownerState.centered && {
    justifyContent: 'center'
  })
}));

const TabsIndicator = styled('span')(({ ownerState, theme }) => ({
  position: 'absolute',
  height: 2,
  bottom: 0,
  width: '100%',
  transition: theme.transition.create(),
  backgroundColor: theme.color[ownerState.indicatorColor]?.body || ownerState.indicatorColor,
  ...(ownerState.vertical && {
    height: '100%',
    width: 2,
    right: 0
  })
}));

const defaultIndicatorStyle = {};
let warnedOnceTabPresent = false;

const TabsList = React.forwardRef((props, ref) => {
  const theme = useTheme();
  const {
    action,
    allowScrollButtonsMobile = false,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    centered = false,
    children: childrenProp,
    component = 'div',
    indicatorColor = 'primary',
    scrollButtons = 'auto',
    ScrollButtonComponent = TabScrollButton,
    slots = {},
    slotProps = {},
    TabIndicatorProps = {},
    TabScrollButtonProps = {},
    textColor = 'primary',
    variant = 'standard',
    visibleScrollbar = false,
    ...otherProps
  } = props;
  const { cssStyles, other } = extractStyling(otherProps);

  const { isRtl, orientation, selectedValue, subitemKeys, getRootProps, contextValue } =
    useTabsList({
      rootRef: ref
    });

  const scrollable = variant === 'scrollable';
  const vertical = orientation === 'vertical';

  const scrollStart = vertical ? 'scrollTop' : 'scrollLeft';
  const start = vertical ? 'top' : 'left';
  const end = vertical ? 'bottom' : 'right';
  const clientSize = vertical ? 'clientHeight' : 'clientWidth';
  const size = vertical ? 'height' : 'width';

  if (!import.meta.env.PROD) {
    if (centered && scrollable) {
      console.error(
        `You can not use the 'centered={true}' and 'variant="scrollable"' properties at the same time on a 'Tabs' component.`
      );
    }
  }

  const ownerState = {
    ...props,
    allowScrollButtonsMobile,
    centered: centered && !scrollable,
    cssStyles,
    fixed: !scrollable,
    hideScrollbar: scrollable && !visibleScrollbar,
    indicatorColor,
    isRtl,
    orientation,
    scrollButtons,
    scrollButtonsHideMobile: !allowScrollButtonsMobile,
    scrollableX: scrollable && !vertical,
    scrollableY: scrollable && vertical,
    vertical
  };

  const classes = {
    root: [tabsListClasses.root, ownerState.orientation && tabsListClasses[orientation]],
    flexContainer: [
      tabsListClasses.flexContainer,
      ownerState.orientation && tabsListClasses[orientation],
      ownerState.centered && tabsListClasses.centered
    ],
    indicator: tabsListClasses.indicator,
    scroller: [
      tabsListClasses.scroller,
      ownerState.fixed && tabsListClasses.fixed,
      ownerState.hideScrollbar && tabsListClasses.hideScrollbar,
      ownerState.scrollableX && tabsListClasses.scrollableX,
      ownerState.scrollableY && tabsListClasses.scrollableY
    ],
    scrollButtons: [
      tabsListClasses.scrollButtons,
      ownerState.scrollButtonsHideMobile && tabsListClasses.scrollButtonsHideMobile
    ]
  };

  const [mounted, setMounted] = React.useState(false);
  const [indicatorStyle, setIndicatorStyle] = React.useState(defaultIndicatorStyle);
  const [displayScroll, setDisplayScroll] = React.useState({
    start: false,
    end: false
  });

  const scrollbarSize = useScrollbarSize(scrollable);

  const [scrollerStyle, setScrollerStyle] = React.useState({
    margin: vertical ? `margin${isRtl ? 'Left' : 'Right'}` : 'marginBottom',
    overflow: 'hidden',
    scrollbarHeight: 0,
    scrollbarWidth: 0
  });

  React.useEffect(() => {
    setScrollerStyle((prevState) => ({
      ...prevState,
      overflow: scrollable ? null : 'hidden',
      scrollbarHeight: scrollbarSize.height,
      scrollbarWidth: scrollbarSize.width
    }));
  }, [scrollable, scrollbarSize]);

  // const valueToIndex = new Map();
  const tabsRef = React.useRef(null);
  const tabListRef = React.useRef(null);

  const getTabsMeta = () => {
    const tabsNode = tabsRef.current;
    let tabsMeta;
    if (tabsNode) {
      const rect = tabsNode.getBoundingClientRect();
      tabsMeta = {
        clientWidth: tabsNode.clientWidth,
        scrollLeft: tabsNode.scrollLeft,
        scrollTop: tabsNode.scrollTop,
        scrollLeftNormalized: getNormalizedScrollLeft(tabsNode, isRtl ? 'rtl' : 'ltr'),
        scrollWidth: tabsNode.scrollWidth,
        top: rect.top,
        bottom: rect.bottom,
        left: rect.left,
        right: rect.right
      };
    }

    let tabMeta;
    if (tabsNode && selectedValue !== null && subitemKeys.length) {
      const currentChildren = tabListRef.current.children;

      if (currentChildren.length > 0) {
        const tab = currentChildren[subitemKeys.indexOf(selectedValue)];
        if (!import.meta.env.PROD) {
          if (!tab) {
            console.error(
              `The 'value' provided to the Tabs component is invalid. None of the Tabs' children match with "${selectedValue}". Provide one of the following values: ${subitemKeys}.`
            );
          }
        }
        tabMeta = tab ? tab.getBoundingClientRect() : null;

        if (!import.meta.env.PROD) {
          if (
            import.meta.env.PROD !== 'test' &&
            !warnedOnceTabPresent &&
            tabMeta &&
            tabMeta.width === 0 &&
            tabMeta.height === 0
          ) {
            tabsMeta = null;
            console.error(
              `The 'value' provided to the Tabs component is invalid. The Tab with this 'value' ("${selectedValue}") is not part of the document layout. Make sure the tab item is present in the document or that it's not 'display: none'.`
            );

            warnedOnceTabPresent = true;
          }
        }
      }
    }
    return { tabsMeta, tabMeta };
  };

  const updateIndicatorState = useEventCallback(() => {
    const { tabsMeta, tabMeta } = getTabsMeta();
    let startValue = 0;
    let startIndicator;

    if (vertical) {
      startIndicator = 'top';
      if (tabMeta && tabsMeta) {
        startValue = tabMeta.top - tabsMeta.top + tabsMeta.scrollTop;
      }
    } else {
      startIndicator = isRtl ? 'right' : 'left';
      if (tabMeta && tabsMeta) {
        const correction = isRtl
          ? tabsMeta.scrollLeftNormalized + tabsMeta.clientWidth - tabsMeta.scrollWidth
          : tabsMeta.scrollLeft;
        startValue =
          (isRtl ? -1 : 1) * (tabMeta[startIndicator] - tabsMeta[startIndicator] + correction);
      }
    }

    const newIndicatorStyle = {
      [startIndicator]: startValue,
      [size]: tabMeta ? tabMeta[size] : 0
    };

    if (isNaN(indicatorStyle[startIndicator]) || isNaN(indicatorStyle[size])) {
      setIndicatorStyle(newIndicatorStyle);
    } else {
      const dStart = Math.abs(indicatorStyle[startIndicator] - newIndicatorStyle[startIndicator]);
      const dSize = Math.abs(indicatorStyle[size] - newIndicatorStyle[size]);

      if (dStart >= 1 || dSize >= 1) {
        setIndicatorStyle(newIndicatorStyle);
      }
    }
  });

  const scroll = (scrollValue, { animation = true } = {}) => {
    if (animation) {
      animate(scrollStart, tabsRef.current, scrollValue, {
        duration: theme.transition.duration.standard
      });
    } else {
      tabsRef.current[scrollStart] = scrollValue;
    }
  };

  const getScrollSize = () => {
    const containerSize = tabsRef.current[clientSize];
    let totalSize = 0;
    const children = Array.from(tabListRef.current.children);

    for (let i = 0; i < children.length; i += 1) {
      const tab = children[i];
      if (totalSize + tab[clientSize] > containerSize) {
        if (i === 0) {
          totalSize = containerSize;
        }
        break;
      }
      totalSize += tab[clientSize];
    }

    return totalSize;
  };

  const moveTabsScroll = (delta) => {
    let scrollValue = tabsRef.current[scrollStart];

    if (vertical) {
      scrollValue += delta;
    } else {
      scrollValue += delta * (isRtl ? -1 : 1);
      scrollValue *= isRtl && detectScrollType() === 'reverse' ? -1 : 1;
    }

    scroll(scrollValue);
  };

  const handleStartScrollClick = () => {
    moveTabsScroll(-1 * getScrollSize());
  };

  const handleEndScrollClick = () => {
    moveTabsScroll(getScrollSize());
  };

  const getConditionalElements = () => {
    const conditionalElements = {};

    const scrollButtonsActive = displayScroll.start || displayScroll.end;
    const showScrollButtons =
      scrollable && ((scrollButtons === 'auto' && scrollButtonsActive) || scrollButtons === true);

    conditionalElements.scrollButtonStart = showScrollButtons ? (
      <ScrollButtonComponent
        slots={{ StartScrollButtonIcon: slots.StartScrollButtonIcon }}
        slotProps={{ startScrollButtonIcon: startScrollButtonIconProps }}
        orientation={orientation}
        direction={isRtl ? 'right' : 'left'}
        onClick={handleStartScrollClick}
        disabled={!displayScroll.start}
        {...TabScrollButtonProps}
        className={clsx(classes.scrollButtons, TabScrollButtonProps.className)}
      />
    ) : null;

    conditionalElements.scrollButtonEnd = showScrollButtons ? (
      <ScrollButtonComponent
        slots={{ EndScrollButtonIcon: slots.EndScrollButtonIcon }}
        slotProps={{
          endScrollButtonIcon: endScrollButtonIconProps
        }}
        orientation={orientation}
        direction={isRtl ? 'left' : 'right'}
        onClick={handleEndScrollClick}
        disabled={!displayScroll.end}
        {...TabScrollButtonProps}
        className={clsx(classes.scrollButtons, TabScrollButtonProps.className)}
      />
    ) : null;

    return conditionalElements;
  };

  const scrollSelectedIntoView = useEventCallback((animation) => {
    const { tabsMeta, tabMeta } = getTabsMeta();

    if (!tabMeta || !tabsMeta) {
      return;
    }

    if (tabMeta[start] < tabsMeta[start]) {
      // left side of button is out of view
      const nextScrollStart = tabsMeta[scrollStart] + (tabMeta[start] - tabsMeta[start]);
      scroll(nextScrollStart, { animation });
    } else if (tabMeta[end] > tabsMeta[end]) {
      // right side of button is out of view
      const nextScrollStart = tabsMeta[scrollStart] + (tabMeta[end] - tabsMeta[end]);
      scroll(nextScrollStart, { animation });
    }
  });

  const updateScrollButtonState = useEventCallback(() => {
    if (scrollable && scrollButtons !== false) {
      const { scrollTop, scrollHeight, clientHeight, scrollWidth, clientWidth } = tabsRef.current;
      let showStartScroll;
      let showEndScroll;

      if (vertical) {
        showStartScroll = scrollTop > 1;
        showEndScroll = scrollTop < scrollHeight - clientHeight - 1;
      } else {
        const scrollLeft = getNormalizedScrollLeft(tabsRef.current, theme.direction);
        showStartScroll = isRtl ? scrollLeft < scrollWidth - clientWidth - 1 : scrollLeft > 1;
        showEndScroll = !isRtl ? scrollLeft < scrollWidth - clientWidth - 1 : scrollLeft > 1;
      }

      if (showStartScroll !== displayScroll.start || showEndScroll !== displayScroll.end) {
        setDisplayScroll({ start: showStartScroll, end: showEndScroll });
      }
    }
  });

  React.useEffect(() => {
    const handleResize = debounce(() => {
      updateIndicatorState();
      updateScrollButtonState();
    });
    const win = ownerWindow(tabsRef.current);
    win.addEventListener('resize', handleResize);

    let resizeObserver;

    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(handleResize);
      Array.from(tabListRef.current.children).forEach((child) => {
        resizeObserver.observe(child);
      });
    }

    return () => {
      handleResize.clear();
      win.removeEventListener('resize', handleResize);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [updateIndicatorState, updateScrollButtonState]);

  const handleTabsScroll = React.useMemo(
    () =>
      debounce(() => {
        updateScrollButtonState();
      }),
    [updateScrollButtonState]
  );

  React.useEffect(() => {
    return () => {
      handleTabsScroll.clear();
    };
  }, [handleTabsScroll]);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    updateIndicatorState();
    updateScrollButtonState();
  });

  React.useEffect(() => {
    // Don't animate on the first render.
    scrollSelectedIntoView(defaultIndicatorStyle !== indicatorStyle);
  }, [scrollSelectedIntoView, indicatorStyle]);

  React.useImperativeHandle(
    action,
    () => ({
      updateIndicator: updateIndicatorState,
      updateScrollButtons: updateScrollButtonState
    }),
    [updateIndicatorState, updateScrollButtonState]
  );

  const tabsIndicatorAs = slots.indicator ?? 'span';
  const tabsIndicatorProps = useSlotProps({
    elementType: TabsIndicator,
    externalSlotProps: slotProps.indicator,
    externalForwardedProps: TabIndicatorProps,
    additionalProps: {
      style: {
        ...indicatorStyle,
        ...TabIndicatorProps.style
      }
    },
    ownerState,
    className: clsx(classes.indicator, TabIndicatorProps.className)
  });

  const indicator = <TabsIndicator as={tabsIndicatorAs} {...tabsIndicatorProps} />;

  const children = React.Children.map(childrenProp, (child) => {
    if (!React.isValidElement(child)) {
      return null;
    }

    if (!import.meta.env.PROD) {
      if (isFragment(child)) {
        console.error(
          `The Tabs component doesn't accept a Fragment as a child. Consider providing an array instead.`
        );
      }
    }
    return React.cloneElement(child, {
      fullWidth: variant === 'fullWidth',
      indicator: !mounted && indicator,
      textColor
    });
  });

  const startScrollButtonIconProps = useSlotProps({
    elementType: slots.StartScrollButtonIcon,
    externalSlotProps: slotProps.startScrollButtonIcon,
    ownerState
  });

  const endScrollButtonIconProps = useSlotProps({
    elementType: slots.EndScrollButtonIcon,
    externalSlotProps: slotProps.endScrollButtonIcon,
    ownerState
  });

  const TabsListRootComponent = slots.root ?? TabsListRoot;
  const tabsListRootProps = useSlotProps({
    elementType: TabsListRoot,
    externalSlotProps: slotProps.root,
    externalForwardedProps: other,
    ownerState,
    className: classes.root
  });

  const TabsScrollerComponent = slots.scroller ?? TabsScroller;
  const tabsScrollerProps = useSlotProps({
    elementType: TabsScrollerComponent,
    externalSlotProps: slotProps.scroller,
    additionalProps: {
      onScroll: handleTabsScroll,
      ref: tabsRef,
      style: {
        overflow: scrollerStyle.overflow,
        [`${scrollerStyle.margin}`]: visibleScrollbar
          ? undefined
          : vertical
          ? -scrollerStyle.scrollbarWidth
          : -scrollerStyle.scrollbarHeight
      }
    },
    ownerState,
    className: classes.scroller
  });

  const FlexContainerComponent = slots.flexContainer ?? FlexContainer;
  const flexContainerProps = useSlotProps({
    elementType: FlexContainerComponent,
    getSlotProps: getRootProps,
    externalSlotProps: slotProps.flexContainer,
    additionalProps: {
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      ref: tabListRef
    },
    ownerState,
    className: classes.flexContainer
  });

  const conditionalElements = getConditionalElements();

  return (
    <TabsListProvider value={contextValue}>
      <TabsListRootComponent as={component} {...tabsListRootProps}>
        {conditionalElements.scrollButtonStart}
        <TabsScrollerComponent {...tabsScrollerProps}>
          <FlexContainerComponent {...flexContainerProps}>{children}</FlexContainerComponent>
          {mounted && indicator}
        </TabsScrollerComponent>
        {conditionalElements.scrollButtonEnd}
      </TabsListRootComponent>
    </TabsListProvider>
  );
});

TabsList.displayName = 'TabsList';

export default TabsList;
