import React from 'react';
import clsx from 'clsx';
import { styled } from '@styles';
import {
  useId,
  useCompoundItem,
  useEnhancedEffect,
  useForkRef,
  useSlotProps
} from '@components/lib';
import ListProvider, { useListContext } from './ListProvider';
import useListItem from './useListItem';
import { useButton, ButtonBase } from '@components/inputs';
import { listItemButtonClasses } from '../List/ListItemButton';
import { ListItemSecondaryAction } from '../List';

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

function tabValueGenerator(otherTabValues) {
  return otherTabValues.size;
}

const ListItem = React.forwardRef((props, ref) => {
  const {
    action,
    alignItems = 'center',
    autoFocus = false,
    button = false,
    children,
    className,
    component: componentProp,
    dense: denseProp = false,
    disabled = false,
    disableGutters = false,
    disablePadding = false,
    divider = false,
    focusVisibleClassName,
    id: idProp,
    onChange,
    onClick,
    onFocus,
    selected: selectedProp = false,
    secondaryAction,
    slotProps = {},
    slots = {},
    value: valueProp,
    ...other
  } = props;

  const tabRef = React.useRef();
  const id = useId(idProp);

  const { value: selectedValue, selectionFollowsFocus, dense } = useListContext();

  const tabMetadata = React.useMemo(() => ({ disabled, ref: tabRef, id }), [disabled, tabRef, id]);

  const {
    id: value,
    index,
    totalItemCount: totalTabsCount
  } = useCompoundItem(valueProp ?? tabValueGenerator, tabMetadata);

  const {
    getRootProps: getTabProps,
    rootRef: listItemRefHandler,
    highlighted,
    selected
  } = useListItem({
    item: value
  });

  const {
    getRootProps: getButtonProps,
    rootRef: buttonRefHandler,
    active,
    focusVisible,
    setFocusVisible
  } = useButton({
    disabled,
    focusableWhenDisabled: !selectionFollowsFocus,
    type: 'button'
  });

  const handleRef = useForkRef(tabRef, ref, listItemRefHandler, buttonRefHandler);

  const getRootProps = (otherHandlers) => {
    const resolvedTabProps = {
      ...otherHandlers,
      ...getTabProps(otherHandlers)
    };

    const resolvedButtonProps = {
      ...resolvedTabProps,
      ...getButtonProps(resolvedTabProps)
    };

    return {
      ...resolvedButtonProps,
      role: 'tab',
      'aria-selected': selected,
      id,
      ref: handleRef
    };
  };

  const childContext = React.useMemo(
    () => ({
      dense: denseProp || dense || false,
      alignItems,
      disableGutters
    }),
    [alignItems, dense, denseProp, disableGutters]
  );

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
    selected: false
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

  const Root = slots.root || ListItemRoot;
  const rootProps = useSlotProps({
    elementType: Root,
    getSlotProps: getRootProps,
    externalSlotProps: slotProps.root,
    externalForwardedProps: other,
    additionalProps: {
      ref: ref
    },
    ownerState,
    className: clsx(classes.root, className)
  });

  let Component = componentProp || 'li';
  let componentProps = {};

  if (button) {
    componentProps.focusVisibleClassName = clsx(classes.focusVisible, focusVisibleClassName);
    Component = ButtonBase;
  }

  return (
    <ListProvider value={childContext}>
      <Root
        {...rootProps}
        as={Component}
        {...(!(typeof Root === 'string') && {
          ownerState: { ...ownerState, ...rootProps.ownerState }
        })}
        {...componentProps}
      >
        {children}
        {secondaryAction && <ListItemSecondaryAction>{secondaryAction}</ListItemSecondaryAction>}
      </Root>
    </ListProvider>
  );
});

ListItem.displayName = 'ListItem';

export default ListItem;
