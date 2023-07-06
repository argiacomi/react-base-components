import { baseListActions } from '@BaseList';
import React from 'react';
import styled, { extractStyling, shouldForwardProp, useTheme } from '@styles';
import { useSlotProps } from '@components/lib';
import List from '@components/Display/List';
import Popover, { PopoverPopper } from '@components/Utils/Popover/Popover';
import useMenu, { MenuProvider } from './useMenu';

export const menuClasses = {
  root: 'Menu-Root',
  list: 'Menu-List',
  popper: 'Menu-Popper',
  expanded: 'Expanded'
};

const RTL_ORIGIN = {
  vertical: 'top',
  horizontal: 'right'
};

const LTR_ORIGIN = {
  vertical: 'top',
  horizontal: 'left'
};

const MenuRoot = styled(Popover, {
  shouldForwardProp: (prop) => shouldForwardProp(prop) || prop === 'classes',
  name: 'Menu',
  slot: 'Root'
})({});

export const MenuPopper = styled(PopoverPopper, {
  name: 'Menu',
  slot: 'Popper'
})(({ ownerState }) => ({
  maxHeight: 'calc(100% - 96px)',
  WebkitOverflowScrolling: 'touch',
  overflow: ownerState.arrow ? 'visible' : undefined
}));

const MenuListRoot = styled(List, {
  name: 'Menu',
  slot: 'List'
})({});

const Menu = React.forwardRef((props, ref) => {
  const {
    actions,
    anchorEl,
    arrow = false,
    anchorOrigin = { vertical: 'bottom', horizontal: 'left' },
    children,
    defaultOpen = 'false',
    dense = false,
    listId,
    disableScrollLock = true,
    onItemsChange,
    onOpenChange,
    open: openProp,
    slots = {},
    slotProps = {},
    transformOrigin,
    transition = 'Grow',
    transitionDuration = 'auto',
    TransitionProps = {},
    variant = 'selectedMenu',
    ...otherProps
  } = props;

  const { cssStyles, other } = extractStyling(otherProps);

  const theme = useTheme();
  const isRtl = theme.direction === 'rtl';

  const { contextValue, dispatch, getListProps, open } = useMenu({
    defaultOpen,
    open: openProp,
    onItemsChange,
    onOpenChange,
    listId
  });

  React.useImperativeHandle(
    actions,
    () => ({
      dispatch,
      resetHighlight: () => dispatch({ type: baseListActions.resetHighlight, event: null })
    }),
    [dispatch]
  );

  const ownerState = {
    ...props,
    cssStyles,
    disablePadding: slotProps.list?.disablePadding,
    open,
    subheader: slotProps.list?.subheader,
    transitionDuration,
    TransitionProps,
    variant
  };

  const classes = {
    root: [menuClasses.root, ownerState.open && menuClasses.expanded],
    list: [menuClasses.list, ownerState.open && menuClasses.expanded],
    popper: menuClasses.popper
  };

  const Root = slots.root ?? MenuRoot;
  const MenuList = slots.list ?? MenuListRoot;

  const rootProps = useSlotProps({
    elementType: Root,
    externalForwardedProps: other,
    externalSlotProps: slotProps.root,
    additionalProps: {
      anchorEl,
      anchorOrigin,
      arrow,
      disableScrollLock,
      open,
      role: undefined,
      ref: ref,
      slots: { popper: slots.popper || MenuPopper },
      slotProps: { popper: { ...slotProps.popper, ...cssStyles, className: classes.popper } },
      transformOrigin: transformOrigin || (isRtl ? RTL_ORIGIN : LTR_ORIGIN),
      transition,
      transitionDuration,
      TransitionProps
    },
    className: classes.root,
    ownerState
  });

  const listProps = useSlotProps({
    elementType: MenuList,
    getSlotProps: getListProps,
    externalSlotProps: slotProps.list,
    additionalProps: {
      dense,
      role: 'menu',
      variant
    },
    ownerState,
    className: classes.list
  });

  return (
    <Root {...rootProps}>
      <MenuProvider value={contextValue}>
        <MenuList {...listProps}>{children}</MenuList>
      </MenuProvider>
    </Root>
  );
});

Menu.displayName = 'Menu';

export default Menu;
