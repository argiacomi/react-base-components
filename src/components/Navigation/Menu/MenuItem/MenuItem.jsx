import { useListContext } from '@BaseList/ListContext';
import React from 'react';
import clsx from 'clsx';
import styled, { extractStyling, shouldForwardProp } from '@styles';
import { useSlotProps } from '@components/lib';
import {
  dividerClasses,
  ListItemContext,
  listItemIconClasses,
  listItemTextClasses
} from '@components/Display';
import { ButtonBase } from '@components/Inputs/Button';
import useMenuItem from './useMenuItem';

export const menuItemClasses = {
  root: 'MenuItem-Root',
  dense: 'Dense',
  disabled: 'Disabled',
  divider: 'Divider',
  gutters: 'Gutters',
  selected: 'Selected',
  focusVisible: 'FocusVisible'
};

const MenuItemRoot = styled(ButtonBase, {
  shouldForwardProp: (prop) => shouldForwardProp(prop) || prop === 'classes',
  name: 'MenuItem',
  slot: 'Root'
})(({ theme, ownerState }) => ({
  ...theme.text.typography.body1,
  display: 'flex',
  width: '100%',
  justifyContent: 'flex-start',
  alignItems: 'center',
  position: 'relative',
  textDecoration: 'none',
  minHeight: 48,
  paddingTop: 6,
  paddingBottom: 6,
  boxSizing: 'border-box',
  whiteSpace: 'nowrap',
  ...(!ownerState.disableGutters && {
    paddingLeft: 16,
    paddingRight: 16
  }),
  ...(ownerState.divider && {
    borderBottom: `1px solid ${theme.color.divider}`,
    backgroundClip: 'padding-box'
  }),
  '&:hover': {
    textDecoration: 'none',
    backgroundColor: theme.color.hover,
    '@media (hover: none)': {
      backgroundColor: 'transparent'
    }
  },
  [`&.${menuItemClasses.selected}`]: {
    backgroundColor: theme.alpha.add(theme.color.primary.body, theme.color.selectedOpacity),
    [`&.${menuItemClasses.focusVisible}`]: {
      backgroundColor: theme.alpha.add(
        theme.color.primary.body,
        theme.color.selectedOpacity + theme.color.focusOpacity
      )
    }
  },
  [`&.${menuItemClasses.selected}:hover`]: {
    backgroundColor: theme.alpha.add(
      theme.color.primary.body,
      theme.color.selectedOpacity + theme.color.hoverOpacity
    ),
    '@media (hover: none)': {
      backgroundColor: theme.alpha.add(theme.color.primary.body, theme.color.selectedOpacity)
    }
  },
  [`&.${menuItemClasses.focusVisible}`]: {
    backgroundColor: theme.color.focus
  },
  [`&.${menuItemClasses.disabled}`]: {
    opacity: theme.color.disabledOpacity
  },
  [`& + .${dividerClasses.root}`]: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1)
  },
  [`& + .${dividerClasses.inset}`]: {
    marginLeft: 52
  },
  [`& .${listItemTextClasses.root}`]: {
    marginTop: 0,
    marginBottom: 0
  },
  [`& .${listItemTextClasses.inset}`]: {
    paddingLeft: 36
  },
  [`& .${listItemIconClasses.root}`]: {
    minWidth: 36
  },
  ...(!ownerState.dense && {
    [theme.breakpoints.up('sm')]: {
      minHeight: 'auto'
    }
  }),
  ...(ownerState.dense && {
    minHeight: 32,
    paddingTop: 4,
    paddingBottom: 4,
    ...theme.text.typography.body2,
    [`& .${listItemIconClasses.root} svg`]: {
      fontSize: '1.25rem'
    }
  }),
  ...ownerState.cssStyles
}));

const MenuItem = React.forwardRef((props, ref) => {
  const {
    children,
    component = 'li',
    dense = false,
    disabled: disabledProp = false,
    disableGutters = false,
    divider = false,
    focusVisibleClassName,
    label,
    role = 'menuitem',
    slotProps = {},
    slots = {},
    ...otherProps
  } = props;

  const { cssStyles, other } = extractStyling(otherProps);

  const { getRootProps, disabled, focusVisible, highlighted, selected } = useMenuItem({
    disabled: disabledProp,
    rootRef: ref,
    label
  });

  const context = useListContext();
  const childContext = React.useMemo(
    () => ({
      dense: dense || context.dense || false,
      disableGutters
    }),
    [context.dense, dense, disableGutters]
  );

  const ownerState = {
    ...props,
    cssStyles,
    dense: childContext.dense,
    divider,
    disableGutters,
    disabled,
    focusVisible,
    selected
  };

  const classes = {
    root: [
      menuItemClasses.root,
      ownerState.dense && menuItemClasses.dense,
      ownerState.disabled && menuItemClasses.disabled,
      !ownerState.disableGutters && menuItemClasses.gutters,
      ownerState.divider && menuItemClasses.divider,
      ownerState.focusVisible && clsx(menuItemClasses.focusVisible && focusVisibleClassName),
      ownerState.selected && menuItemClasses.selected
    ]
  };

  const Root = slots.root ?? MenuItemRoot;
  const rootProps = useSlotProps({
    elementType: Root,
    getSlotProps: getRootProps,
    externalSlotProps: slotProps.root,
    externalForwardedProps: other,
    additionalProps: { role },
    className: classes.root,
    ownerState
  });

  return (
    <ListItemContext.Provider value={childContext}>
      <Root component={component} {...rootProps}>
        {children}
      </Root>
    </ListItemContext.Provider>
  );
});

MenuItem.displayName = 'MenuItem';

export default MenuItem;
