import React from 'react';
import clsx from 'clsx';
import { styled } from '@styles';
import { useCompoundParent, useControlled, useSlotProps } from '@components/lib';
import useList from './useList';
import ListProvider from './ListProvider';

const ListRoot = styled('ul')(({ ownerState }) => ({
  listStyle: 'none',
  margin: 0,
  padding: 0,
  position: 'relative',
  ...(!ownerState.disablePadding && {
    paddingTop: 8,
    paddingBottom: 8
  }),
  ...(ownerState.subheader && {
    paddingTop: 0
  })
}));

const List = React.forwardRef((props, ref) => {
  const {
    children,
    className,
    component = 'ul',
    defaultValue,
    dense = false,
    direction = 'ltr',
    disablePadding = false,
    onChange,
    orientation = 'horizontal',
    selectionFollowsFocus = false,
    slotProps = {},
    subheader,
    value: valueProp,
    ...other
  } = props;

  const [value, setValue] = useControlled({
    controlled: valueProp,
    default: defaultValue,
    name: 'List',
    state: 'value'
  });

  const onSelected = React.useCallback(
    (event, newValue) => {
      setValue(newValue);
      onChange?.(event, newValue);
    },
    [onChange, setValue]
  );

  const { subitems, contextValue: compoundComponentContextValue } = useCompoundParent();

  const itemIdLookup = React.useRef();

  itemIdLookup.current = React.useCallback(
    (itemValue) => {
      return subitems.get(itemValue)?.id;
    },
    [subitems]
  );

  const subitemKeys = React.useMemo(() => Array.from(subitems.keys()), [subitems]);

  const getListElement = React.useCallback(
    (itemValue) => {
      if (itemValue == null) {
        return null;
      }

      return subitems.get(itemValue)?.ref.current ?? null;
    },
    [subitems]
  );

  const isRtl = direction === 'rtl';

  let listOrientation;
  if (orientation === 'vertical') {
    listOrientation = 'vertical';
  } else {
    listOrientation = isRtl ? 'horizontal-rtl' : 'horizontal-ltr';
  }

  const handleChange = React.useCallback(
    (event, newValue) => {
      onSelected(event, newValue[0] ?? null);
    },
    [onSelected]
  );

  const controlledProps = React.useMemo(() => {
    if (value === undefined) {
      return {};
    }

    return value != null ? { selectedValues: [value] } : { selectedValues: [] };
  }, [value]);

  const isItemDisabled = React.useCallback(
    (item) => subitems.get(item)?.disabled ?? false,
    [subitems]
  );

  const {
    contextValue: listContextValue,
    dispatch,
    getRootProps: getListboxRootProps
  } = useList({
    controlledProps,
    disabledItemsFocusable: !selectionFollowsFocus,
    focusManagement: 'DOM',
    getItemDomElement: getListElement,
    isItemDisabled,
    items: subitemKeys,
    rootRef: ref,
    onChange: handleChange,
    orientation: listOrientation,
    reducerActionContext: React.useMemo(
      () => ({ selectionFollowsFocus: selectionFollowsFocus || false }),
      [selectionFollowsFocus]
    ),
    selectionMode: 'single'
  });

  React.useEffect(() => {
    if (value === undefined) {
      return;
    }

    if (value != null) {
      dispatch({
        type: 'valueChange',
        value
      });
    }
  }, [dispatch, value]);

  const getRootProps = (otherHandlers) => {
    return {
      ...otherHandlers,
      ...getListboxRootProps(otherHandlers),
      'aria-orientation': orientation === 'vertical' ? 'vertical' : undefined,
      role: 'list'
    };
  };

  const contextValue = { dense, ...compoundComponentContextValue, ...listContextValue };

  const ownerState = {
    ...props,
    component,
    dense,
    disablePadding,
    isRtl,
    orientation
  };

  const listRootProps = useSlotProps({
    elementType: ListRoot,
    getSlotProps: getRootProps,
    externalSlotProps: slotProps.root,
    externalForwardedProps: other,
    ownerState: ownerState,
    className: clsx('List-Root', className)
  });

  return (
    <ListProvider value={contextValue}>
      <ListRoot {...listRootProps}>
        {subheader}
        {children}
      </ListRoot>
    </ListProvider>
  );
});

List.displayName = 'List';

export default List;
