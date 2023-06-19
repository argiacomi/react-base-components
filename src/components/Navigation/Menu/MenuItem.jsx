import * as React from 'react';
import clsx from 'clsx';
import { styled } from '@styles';
import { useEnhancedEffect, useForkRef } from '@components/lib';
import {
  ListContext,
  dividerClasses,
  listItemIconClasses,
  listItemTextClasses
} from '@components/display';
import { ButtonBase } from '@components/inputs';

const menuItemClasses = {
  root: 'MenuItem-Root',
  selected: 'MenuItem-Selected',
  disabled: 'MenuItem-Disabled',
  focusVisible: 'MenuItem-FocusVisible'
};

const MenuItemRoot = styled(ButtonBase)(({ theme, ownerState }) => ({
  ...theme.text.typography.body1,
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  position: 'relative',
  textDecoration: 'none',
  minHeight: theme.spacing(6),
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
    backgroundColor: theme.color.text.secondary,
    '@media (hover: none)': {
      backgroundColor: 'transparent'
    }
  },
  [`&.${menuItemClasses.selected}`]: {
    backgroundColor: theme.alpha.add(
      theme.color.primary.body,
      theme.color.mode === 'light' ? 0.08 : 0.16
    ),
    [`&.${menuItemClasses.focusVisible}`]: {
      backgroundColor: theme.alpha.add(
        theme.color.primary.body,
        theme.color.mode === 'light' ? 0.2 : 0.28
      )
    }
  },
  [`&.${menuItemClasses.selected}:hover`]: {
    backgroundColor: theme.alpha.add(
      theme.color.primary.main,
      theme.color.mode === 'light' ? 0.2 : 0.28
    ),
    '@media (hover: none)': {
      backgroundColor: theme.alpha.add(
        theme.color.primary.body,
        theme.color.mode === 'light' ? 0.08 : 0.16
      )
    }
  },
  [`&.${menuItemClasses.focusVisible}`]: {
    backgroundColor: theme.alpha.add(theme.color.background, 0.12)
  },
  [`&.${menuItemClasses.disabled}`]: {
    opacity: 0.38
  },
  [`& + .${dividerClasses.root}`]: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1)
  },
  [`& + .${dividerClasses.inset}`]: {
    marginLeft: theme.spacing(6.5)
  },
  [`& .${listItemTextClasses.root}`]: {
    marginTop: 0,
    marginBottom: 0
  },
  [`& .${listItemTextClasses.inset}`]: {
    paddingLeft: theme.spacing(4.5)
  },
  [`& .${listItemIconClasses.root}`]: {
    minWidth: theme.spacing(4.5)
  },
  ...(!ownerState.dense && {
    [theme.breakpoints.up('sm')]: {
      minHeight: 'auto'
    }
  }),
  ...(ownerState.dense && {
    ...theme.text.typography.body2,
    minHeight: theme.spacing(2),
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
    [`& .${listItemIconClasses.root} svg`]: {
      fontSize: theme.spacing(2.5)
    }
  })
}));

const MenuItem = React.forwardRef((props, ref) => {
  const {
    autoFocus = false,
    component = 'li',
    dense = false,
    divider = false,
    disableGutters = false,
    focusVisibleClassName,
    role = 'menuitem',
    tabIndex: tabIndexProp,
    className,
    ...other
  } = props;

  const context = React.useContext(ListContext);
  const childContext = React.useMemo(
    () => ({
      dense: dense || context.dense || false,
      disableGutters
    }),
    [context.dense, dense, disableGutters]
  );

  const menuItemRef = React.useRef(null);
  useEnhancedEffect(() => {
    if (autoFocus) {
      if (menuItemRef.current) {
        menuItemRef.current.focus();
      } else if (!import.meta.env.PROD) {
        console.error(`Unable to set focus to a MenuItem whose component has not been rendered.`);
      }
    }
  }, [autoFocus]);

  const ownerState = {
    ...props,
    dense: childContext.dense,
    divider,
    disableGutters
  };

  const classes = {
    root: [
      menuItemClasses.root,
      ownerState.selected && menuItemClasses.selected,
      ownerState.disabled && menuItemClasses.disabled
    ],
    focusVisible: menuItemClasses.focusVisible
  };

  const handleRef = useForkRef(menuItemRef, ref);

  let tabIndex;
  if (!props.disabled) {
    tabIndex = tabIndexProp !== undefined ? tabIndexProp : -1;
  }

  return (
    <ListContext.Provider value={childContext}>
      <MenuItemRoot
        ref={handleRef}
        role={role}
        tabIndex={tabIndex}
        component={component}
        focusVisibleClassName={clsx(classes.focusVisible, focusVisibleClassName)}
        className={clsx(classes.root, className)}
        {...other}
        ownerState={ownerState}
        classes={classes}
      />
    </ListContext.Provider>
  );
});

MenuItem.displayName = 'MenuItem';

export default MenuItem;
