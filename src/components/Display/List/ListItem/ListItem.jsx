import * as React from 'react';
import clsx from 'clsx';
import styled from '@styles';
import { useEnhancedEffect, useForkRef, useSlotProps } from '@components/lib';
import { ButtonBase } from '@components/inputs';
import ListItemContext from './ListItemContext';
import useListItem from './useListItem';
import { listItemButtonClasses } from './ListItemButton';
import ListItemSecondaryAction from './ListItemSecondaryAction';

const listItemClasses = {
  root: 'ListItem-Root',
  focusVisible: 'ListItem-FocusVisible',
  disabled: 'ListItem-Disabled',
  selected: 'ListItem-Selected',
  inset: 'ListItem-Inset'
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
    button = false,
    autoFocus = false,
    children: childrenProp,
    component: componentProp,
    dense: denseProp = false,
    disabled = false,
    disableGutters = false,
    disablePadding = false,
    divider = false,
    focusVisibleClassName,
    secondaryAction,
    slotProps = {},
    slots = {},
    ...other
  } = props;

  const itemRef = React.useRef();
  const handleRef = useForkRef(itemRef, ref);

  const { active, dense, highlighted, selected, getRootProps } = useListItem({
    ...props,
    rootRef: handleRef
  });

  const childContext = React.useMemo(
    () => ({
      dense: denseProp || dense || false,
      alignItems,
      disableGutters
    }),
    [alignItems, denseProp, dense, disableGutters]
  );

  useEnhancedEffect(() => {
    if (autoFocus) {
      if (itemRef.current) {
        itemRef.current.focus();
      } else if (!import.meta.env.PROD) {
        console.error('Unable to set focus to a ListItem whose component has not been rendered.');
      }
    }
  }, [autoFocus]);

  const children = React.Children.toArray(childrenProp);

  const ownerState = {
    ...props,
    active,
    alignItems,
    autoFocus,
    button,
    dense: childContext.dense,
    disabled,
    disableGutters,
    disablePadding,
    divider,
    highlighted,
    selected
  };

  const classes = {
    root: clsx(
      listItemClasses.root,
      ownerState.disabled && listItemClasses.disabled,
      ownerState.selected && listItemClasses.selected,
      ownerState.inset && listItemClasses.inset
    ),
    focusVisible: listItemClasses.focusVisible
  };

  const RootComponent = slots.root || ListItemRoot;
  const listItemRootProps = useSlotProps({
    elementType: RootComponent,
    getSlotProps: getRootProps,
    externalSlotProps: slotProps.root,
    externalForwardedProps: other,
    additionalProps: {
      ref: ref,
      disabled: ownerState.disabled
    },
    ownerState,
    className: classes.root
  });

  let Component = componentProp || 'li';

  if (button) {
    listItemRootProps.component = componentProp || 'div';
    listItemRootProps.focusVisibleClassName = clsx(classes.focusVisible, focusVisibleClassName);

    Component = ButtonBase;
  }

  return (
    <ListItemContext.Provider value={childContext}>
      <ListItemRoot as={Component} {...listItemRootProps}>
        {children}
        {secondaryAction && <ListItemSecondaryAction>{secondaryAction}</ListItemSecondaryAction>}
      </ListItemRoot>
    </ListItemContext.Provider>
  );
});

ListItem.displayName = 'ListItem';

export default ListItem;
