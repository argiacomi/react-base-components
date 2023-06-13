import * as React from 'react';
import clsx from 'clsx';
import { styled } from '@styles';
import { ButtonBase } from '@components/inputs';
import { useEnhancedEffect, useForkRef } from '@components/lib';
import ListContext, { useListContext } from './ListContext';

export const listItemButtonClasses = {
  root: 'ListItemButton-Root',
  focusVisible: 'ListItemButton-FocusVisible',
  disabled: 'ListItemButton-Disabled',
  selected: 'ListItemButton-Selected'
};

const ListItemButtonRoot = styled(ButtonBase)(({ theme, ownerState }) => ({
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
  })
}));

const ListItemButton = React.forwardRef((props, ref) => {
  const {
    alignItems = 'center',
    autoFocus = false,
    component = 'div',
    children,
    dense = false,
    disableGutters = false,
    divider = false,
    focusVisibleClassName,
    selected = false,
    className,
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
        console.error(
          'Unable to set focus to a ListItemButton whose component has not been rendered.'
        );
      }
    }
  }, [autoFocus]);

  const ownerState = {
    ...props,
    alignItems,
    dense: childContext.dense,
    disableGutters,
    divider,
    selected
  };

  const handleRef = useForkRef(listItemRef, ref);

  const classes = clsx(
    ownerState.disabled && listItemButtonClasses.disabled,
    ownerState.selected && listItemButtonClasses.selected
  );

  return (
    <ListContext.Provider value={childContext}>
      <ListItemButtonRoot
        ref={handleRef}
        href={other.href || other.to}
        component={(other.href || other.to) && component === 'div' ? 'button' : component}
        focusVisibleClassName={clsx(listItemButtonClasses.focusVisible, focusVisibleClassName)}
        ownerState={ownerState}
        className={clsx(listItemButtonClasses.root, classes, className)}
        {...other}
        classes={classes}
      >
        {children}
      </ListItemButtonRoot>
    </ListContext.Provider>
  );
});

ListItemButton.displayName = 'ListItemButton';

export default ListItemButton;
