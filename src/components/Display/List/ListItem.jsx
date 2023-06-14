import React from 'react';
import clsx from 'clsx';
import { styled } from '@styles';
import { useEnhancedEffect, useForkRef } from '@components/lib';
import { ButtonBase } from '@components/inputs';
import ListContext, { useListContext } from './ListContext';
import { listItemButtonClasses } from './ListItemButton';
import ListItemSecondaryAction from './ListItemSecondaryAction';

const listItemClasses = {
  root: 'ListItem-Root',
  focusVisible: 'ListItem-FocusVisible',
  disabled: 'ListItem-Disabled',
  selected: 'ListItem-Selected'
};

export const ListItemRoot = styled('div')(({ theme, ownerState }) => ({
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  position: 'relative',
  textDecoration: 'none',
  width: '100%',
  boxSizing: 'border-box',
  textAlign: 'left',
  ...(!ownerState.disablePadding && {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    ...(ownerState.dense && {
      paddingTop: theme.spacing(0.5),
      paddingBottom: theme.spacing(0.5)
    }),
    ...(!ownerState.disableGutters && {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2)
    }),
    ...(!!ownerState.secondaryAction && {
      paddingRight: theme.spacing(6)
    })
  }),
  ...(!!ownerState.secondaryAction && {
    [`& > .${listItemButtonClasses.root}`]: {
      paddingRight: theme.spacing(6)
    }
  }),
  [`&.${listItemClasses.focusVisible}`]: {
    backgroundColor: theme.color.selected
  },
  [`&.${listItemClasses.selected}`]: {
    backgroundColor: theme.alpha.add(
      theme.color.primary.body,
      theme.mode === 'light' ? 0.08 : 0.16
    ),
    [`&.${listItemClasses.focusVisible}`]: {
      backgroundColor: theme.alpha.add(
        theme.color.primary.body,
        theme.mode === 'light' ? 0.2 : 0.28
      )
    }
  },
  [`&.${listItemClasses.disabled}`]: {
    opacity: 0.38
  },
  ...(ownerState.alignItems === 'flex-start' && {
    alignItems: 'flex-start'
  }),
  ...(ownerState.divider && {
    borderBottom: `1px solid ${theme.color.divider}`,
    backgroundClip: 'padding-box'
  }),
  ...(ownerState.button && {
    transition: theme.transition.create('background-color', {
      duration: theme.transition.duration.shortest
    }),
    '&:hover': {
      textDecoration: 'none',
      backgroundColor: theme.color.selected,
      '@media (hover: none)': {
        backgroundColor: 'transparent'
      }
    },
    [`&.${listItemClasses.selected}:hover`]: {
      backgroundColor: theme.alpha.add(
        theme.color.primary.body,
        theme.mode === 'light' ? 0.2 : 0.28
      ),
      '@media (hover: none)': {
        backgroundColor: theme.alpha.add(
          theme.color.primary.body,
          theme.mode === 'light' ? 0.08 : 0.16
        )
      }
    }
  })
}));

const ListItem = React.forwardRef((props, ref) => {
  const {
    alignItems = 'center',
    autoFocus = false,
    button = false,
    children: childrenProp,
    className,
    component: componentProp,
    dense = false,
    disabled = false,
    disableGutters = false,
    disablePadding = false,
    divider = false,
    focusVisibleClassName,
    secondaryAction,
    selected = false,
    slotProps = {},
    slots = {},
    ...other
  } = props;

  const context = useListContext();

  const childContext = React.useMemo(
    () => ({
      dense: dense || context.dense || false,
      alignItems,
      disableGutters
    }),
    [alignItems, context.dense, dense, disableGutters]
  );

  const listItemRef = React.useRef(null);
  useEnhancedEffect(() => {
    if (autoFocus) {
      if (listItemRef.current) {
        listItemRef.current.focus();
      } else if (!import.meta.env.PROD) {
        console.error('Unable to set focus to a ListItem whose component has not been rendered.');
      }
    }
  }, [autoFocus]);

  const children = React.Children.toArray(childrenProp);

  const ownerState = {
    ...props,
    alignItems,
    autoFocus,
    button,
    dense: childContext.dense,
    disabled,
    disableGutters,
    disablePadding,
    divider,
    selected
  };

  const classes = {
    root: clsx(
      listItemClasses.root,
      ownerState.disabled && listItemClasses.disabled,
      ownerState.selected && listItemClasses.selected
    ),
    focusVisible: listItemClasses.focusVisible
  };

  const handleRef = useForkRef(listItemRef, ref);

  const Root = slots.root || ListItemRoot;
  const rootProps = slotProps.root || {};

  const componentProps = {
    className: clsx(classes.root, rootProps.className, className),
    disabled,
    ...other
  };

  let Component = componentProp || 'li';

  if (button) {
    componentProps.component = componentProp || 'div';
    componentProps.focusVisibleClassName = clsx(classes.focusVisible, focusVisibleClassName);

    Component = ButtonBase;
  }

  return (
    <ListContext.Provider value={childContext}>
      <Root
        {...rootProps}
        as={Component}
        ref={handleRef}
        {...(!(typeof Root === 'string') && {
          ownerState: { ...ownerState, ...rootProps.ownerState }
        })}
        {...componentProps}
      >
        {children}
        {secondaryAction && <ListItemSecondaryAction>{secondaryAction}</ListItemSecondaryAction>}
      </Root>
    </ListContext.Provider>
  );
});

ListItem.displayName = 'ListItem';

export default ListItem;
