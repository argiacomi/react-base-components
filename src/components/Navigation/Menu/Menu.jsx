import * as React from 'react';
import { isFragment } from 'react-is';
import clsx from 'clsx';
import MenuList from './MenuList';
import { Popover, PopoverPaper } from '@components/utils';
import { styled, useTheme } from '@styles';

const menuClasses = {
  root: 'Menu-Root',
  paper: 'Menu-Paper',
  list: 'Menu-List'
};

const RTL_ORIGIN = {
  vertical: 'top',
  horizontal: 'right'
};

const LTR_ORIGIN = {
  vertical: 'top',
  horizontal: 'left'
};

const MenuRoot = styled(Popover)({});

export const MenuPaper = styled(PopoverPaper)(({ theme }) => ({
  maxHeight: `calc(100% - ${theme.spacing(12)})`,
  WebkitOverflowScrolling: 'touch'
}));

const MenuMenuList = styled(MenuList)({
  outline: 0
});

const Menu = React.forwardRef((props, ref) => {
  const {
    autoFocus = true,
    children,
    disableAutoFocusItem = false,
    MenuListProps = {},
    onClose,
    open,
    PaperProps = {},
    PopoverClasses,
    transitionDuration = 'auto',
    TransitionProps: { onEntering, ...TransitionProps } = {},
    variant = 'selectedMenu',
    ...other
  } = props;

  const theme = useTheme();
  const isRtl = theme.direction === 'rtl';

  const ownerState = {
    ...props,
    autoFocus,
    disableAutoFocusItem,
    MenuListProps,
    onEntering,
    PaperProps,
    transitionDuration,
    TransitionProps,
    variant
  };

  const autoFocusItem = autoFocus && !disableAutoFocusItem && open;

  const menuListActionsRef = React.useRef(null);

  const handleEntering = (element, isAppearing) => {
    if (menuListActionsRef.current) {
      menuListActionsRef.current.adjustStyleForScrollbar(element, theme);
    }

    if (onEntering) {
      onEntering(element, isAppearing);
    }
  };

  const handleListKeyDown = (event) => {
    if (event.key === 'Tab') {
      event.preventDefault();

      if (onClose) {
        onClose(event, 'tabKeyDown');
      }
    }
  };

  let activeItemIndex = -1;

  React.Children.map(children, (child, index) => {
    if (!React.isValidElement(child)) {
      return;
    }

    if (!import.meta.env.PROD) {
      if (isFragment(child)) {
        console.error(
          `The Menu component doesn't accept a Fragment as a child. Consider providing an array instead.`
        );
      }
    }

    if (!child.props.disabled) {
      if (variant === 'selectedMenu' && child.props.selected) {
        activeItemIndex = index;
      } else if (activeItemIndex === -1) {
        activeItemIndex = index;
      }
    }
  });

  return (
    <MenuRoot
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: isRtl ? 'right' : 'left'
      }}
      transformOrigin={isRtl ? RTL_ORIGIN : LTR_ORIGIN}
      slots={{ paper: MenuPaper }}
      slotProps={{
        paper: {
          ...PaperProps,
          classes: {
            ...PaperProps.classes,
            root: menuClasses.paper
          }
        }
      }}
      className={menuClasses.root}
      open={open}
      ref={ref}
      transitionDuration={transitionDuration}
      TransitionProps={{ onEntering: handleEntering, ...TransitionProps }}
      ownerState={ownerState}
      {...other}
      classes={PopoverClasses}
    >
      <MenuMenuList
        onKeyDown={handleListKeyDown}
        actions={menuListActionsRef}
        autoFocus={autoFocus && (activeItemIndex === -1 || disableAutoFocusItem)}
        autoFocusItem={autoFocusItem}
        variant={variant}
        {...MenuListProps}
        className={clsx(menuClasses.list, MenuListProps.className)}
      >
        {children}
      </MenuMenuList>
    </MenuRoot>
  );
});

Menu.displayName = 'Menu';

export default Menu;
