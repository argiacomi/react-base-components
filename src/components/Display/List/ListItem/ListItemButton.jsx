import React from 'react';
import clsx from 'clsx';
import styled, { extractStyling, shouldForwardProp } from '@styles';
import { useEnhancedEffect, useForkRef, useSlotProps } from '@components/lib';
import ButtonBase from '@components/inputs/button/buttonbase';
import ListItemContext from './ListItemContext';
import useListItem from './useListItem';

export const listItemButtonClasses = {
  root: 'ListItemButton-Root',
  focusVisible: 'FocusVisible',
  disabled: 'Disabled',
  selected: 'Selected'
};

const ListItemButtonRoot = styled(ButtonBase, {
  shouldForwardProp: (prop) => shouldForwardProp(prop) || prop === 'classes',
  name: 'ListItemButton',
  slot: 'Root'
})(({ theme, ownerState }) => ({
  display: 'flex',
  flexGrow: 1,
  justifyContent: 'flex-start',
  alignItems: 'center',
  position: 'relative',
  textDecoration: 'none',
  minWidth: 0,
  boxSizing: 'border-box',
  textAlign: 'left',
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(1),
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
  [`&.${listItemButtonClasses.selected}`]: {
    backgroundColor: theme.alpha.add(
      theme.color.primary.body,
      theme.mode === 'light' ? 0.08 : 0.16
    ),
    [`&.${listItemButtonClasses.focusVisible}`]: {
      backgroundColor: theme.alpha.add(
        theme.color.primary.body,
        theme.mode === 'light' ? 0.2 : 0.28
      )
    }
  },
  [`&.${listItemButtonClasses.selected}:hover`]: {
    backgroundColor: theme.alpha.add(theme.color.primary.body, theme.mode === 'light' ? 0.2 : 0.28),
    '@media (hover: none)': {
      backgroundColor: theme.alpha.add(
        theme.color.primary.body,
        theme.mode === 'light' ? 0.08 : 0.16
      )
    }
  },
  [`&.${listItemButtonClasses.focusVisible}`]: {
    backgroundColor: theme.color.selected
  },
  [`&.${listItemButtonClasses.disabled}`]: {
    opacity: 0.38
  },
  ...(ownerState.divider && {
    borderBottom: `1px solid ${theme.color.divider}`,
    backgroundClip: 'padding-box'
  }),
  ...(ownerState.alignItems === 'flex-start' && {
    alignItems: 'flex-start'
  }),
  ...(!ownerState.disableGutters && {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  }),
  ...(ownerState.dense && {
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5)
  }),
  ...ownerState.cssStyles
}));

const ListItemButton = React.forwardRef((props, ref) => {
  const {
    alignItems = 'center',
    autoFocus = false,
    component = 'div',
    children,
    dense: denseProp = false,
    disableGutters = false,
    divider = false,
    focusVisibleClassName,
    ...otherProps
  } = props;

  const { cssStyles, other } = extractStyling(otherProps);

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
    [alignItems, dense, denseProp, disableGutters]
  );

  useEnhancedEffect(() => {
    if (autoFocus) {
      if (itemRef.current) {
        itemRef.current.focus();
      } else if (!import.meta.env.PROD) {
        console.error(
          'Unable to set focus to a ListItemButton whose component has not been rendered.'
        );
      }
    }
  }, [autoFocus]);

  const ownerState = {
    ...props,
    active,
    alignItems,
    cssStyles,
    dense: childContext.dense,
    disableGutters,
    divider,
    highlighted,
    selected
  };

  const classes = {
    root: [
      listItemButtonClasses.root,
      ownerState.disabled && listItemButtonClasses.disabled,
      ownerState.selected && listItemButtonClasses.selected
    ],
    focusVisible: listItemButtonClasses.focusVisible
  };

  const listItemButtonRootProps = useSlotProps({
    elementType: ListItemButtonRoot,
    getSlotProps: getRootProps,
    externalForwardedProps: other,
    additionalProps: {
      ref: handleRef,
      href: other.href || other.to,
      disabled: ownerState.disabled
    },
    ownerState,
    className: classes.root
  });

  listItemButtonRootProps.component =
    (other.href || other.to) && component === 'div' ? 'button' : component;
  listItemButtonRootProps.focusVisibleClassName = clsx(classes.focusVisible, focusVisibleClassName);

  return (
    <ListItemContext.Provider value={childContext}>
      <ListItemButtonRoot {...listItemButtonRootProps}>{children}</ListItemButtonRoot>
    </ListItemContext.Provider>
  );
});

ListItemButton.displayName = 'ListItemButton';

export default ListItemButton;
